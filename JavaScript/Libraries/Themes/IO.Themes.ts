type ThemeSettings = {
    storageKey: string,
    storage: "localStorage" | "cookie",

    defaultTheme: string,
    defaultDarkTheme: string,
    themes: Array<string>,

    cookieDurationInSeconds: number
}

class IO_Themes {
    instance!: typeof this;
    theme!: string ;
    settings!: ThemeSettings;

    constructor( settings: ThemeSettings ) {

        if (typeof this.instance === "object") {
            return this.instance;
        }

        const defaultSettings: ThemeSettings = {
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

        if (undefined === this.theme) {
            const cookieValue = this.getCookie();
            if (cookieValue) {
                this.theme = cookieValue;
            }
        }

        if (undefined === this.theme && undefined !== window.matchMedia) {
            if(window.matchMedia("(prefers-color-scheme: dark)").matches){
                this.theme = this.settings.defaultDarkTheme;
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

    setCookie(value: string, optionalCookieName: null | string = null) {
        const cookieName = optionalCookieName ? optionalCookieName : this.settings.storageKey;
        const cookieMaxAge = this.settings.cookieDurationInSeconds;
        document.cookie = cookieName+"="+value+"; max-age=" + cookieMaxAge;

        return true;
    }

    setTheme(theme: string) {
        if(!theme) {
            return false;
        }

        // Add class to <body>
        const bodyClassList = window.document.body.classList;
        const themesToRemove = [...this.settings.themes].filter(themeItem => themeItem != theme);

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
        const themes: string[] = [...this.settings.themes];
        for (const theme of themes) {
            if (window.document.body.classList.contains(theme)) {
                return theme;
            }
        }
        return undefined;
    }
}