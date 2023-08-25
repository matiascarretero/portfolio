class IO_Themes {

    theme = null;
    settings = null;

    constructor( settings ) {

        if (typeof this.instance === "object") {
            return this.instance;
        }

        const defaultSettings = {
            storageKey: "io_theme",
            storage: "localStorage",

            defaultTheme: "auto",
            defaultDarkTheme: "dark",
            themes: ["auto", "dark", "light"],

            cookieDurationInSeconds: 60*60*24*365,
        };

        this.settings = {...defaultSettings, ...settings};
        
        // Check if theme was set in localStorage or cookie. If not, match with navigator color scheme
        if ("undefined" !== typeof(Storage) && undefined != window.localStorage[this.settings.storageKey] && window.localStorage[this.settings.storageKey]) {
            this.theme = window.localStorage[this.settings.storageKey];
        }

        if (this.theme===false) {
            const cookieValue = this.getCookie();
            if (cookieValue) {
                this.theme = cookieValue;
            }
        }

        if (this.theme===false && undefined !== window.matchMedia) {
            if(window.matchMedia("(prefers-color-scheme: dark)").matches){
                this.theme = this.settings.themes.dark;
            } else {
                this.theme = this.settings.defaultTheme;
            }
        }
        
        this.setTheme(this.theme);
        this.instance = this;
        return this;
    }

    getCookie(optionalCookieName = null) {
        const cookiesArray = document.cookie.split(";");
        const cookieName = optionalCookieName != "" ? optionalCookieName : this.settings.storageKey;

        for(let i = 0; i < cookiesArray.length; i++) {
            const cookiePair = cookiesArray[i].split("=");
            
            if(cookieName == cookiePair[0].trim() && decodeURIComponent(cookiePair[1]).length > 0) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        
        return false;
    }

    setCookie(value, optionalCookieName = null) {
        const cookieName = optionalCookieName ? optionalCookieName : this.settings.storageKey;
        const cookieMaxAge = this.settings.cookieDurationInSeconds;
        document.cookie = cookieName+"="+value+"; max-age=" + cookieMaxAge;

        return true;
    }

    setTheme(theme = null) {
        if(!theme) {
            return false;
        }

        // Add class to <body>
        const bodyClassList = window.document.body.classList;
        const themesToRemove = [...this.settings.themes];
        delete themesToRemove[theme];

        for (const possibleTheme of themesToRemove) {
            bodyClassList.remove(possibleTheme);
        }

        if(!bodyClassList.contains(theme)) {
            bodyClassList.add(theme);
        }

        // Store current theme
        switch(this.settings.storage) {
            case "localStorage":
                if ("undefined" !== typeof(Storage)) {
                    window.localStorage.setItem(this.settings.storageKey, theme);
                    return true;
                }                
                break;
            case "cookie":
            default:
                this.setCookie(theme);
                return true;
        }

        return false;
    }

    switchTheme() {
        const themes = [...this.settings.themes];
        const currentTheme = this.getActiveTheme() ?? this.settings.defaultTheme;
        const currentThemeIndex = themes.indexOf(currentTheme);
        
        const nextThemeIndex = (currentThemeIndex >= 0 && currentThemeIndex + 1 < themes.length) ? currentThemeIndex + 1 : 0;
        this.setTheme(themes[nextThemeIndex]);

    }

    getActiveTheme() {
        const themes = [...this.settings.themes];
        return themes.find( theme => window.document.body.classList.contains(theme) );
    }
}