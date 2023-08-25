"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var IO_Themes = /** @class */ (function () {
    function IO_Themes(settings) {
        if (typeof this.instance === "object") {
            return this.instance;
        }
        var defaultSettings = {
            storageKey: "io_theme",
            storage: "localStorage",
            defaultTheme: "auto",
            defaultDarkTheme: "dark",
            themes: ["auto", "dark", "light"],
            cookieDurationInSeconds: 60 * 60 * 24 * 365,
        };
        this.settings = __assign(__assign({}, defaultSettings), settings);
        // Check if theme was set in localStorage or cookie. If not, match with navigator color scheme
        if ("undefined" !== typeof (Storage) && undefined != window.localStorage[this.settings.storageKey] && window.localStorage[this.settings.storageKey]) {
            this.theme = window.localStorage[this.settings.storageKey];
        }
        if (undefined === this.theme) {
            var cookieValue = this.getCookie();
            if (cookieValue) {
                this.theme = cookieValue;
            }
        }
        if (undefined === this.theme && undefined !== window.matchMedia) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                this.theme = this.settings.defaultDarkTheme;
            }
            else {
                this.theme = this.settings.defaultTheme;
            }
        }
        this.setTheme(this.theme);
        this.instance = this;
        return this;
    }
    IO_Themes.prototype.getCookie = function (optionalCookieName) {
        if (optionalCookieName === void 0) { optionalCookieName = null; }
        var cookiesArray = document.cookie.split(";");
        var cookieName = optionalCookieName != "" ? optionalCookieName : this.settings.storageKey;
        for (var i = 0; i < cookiesArray.length; i++) {
            var cookiePair = cookiesArray[i].split("=");
            if (cookieName == cookiePair[0].trim() && decodeURIComponent(cookiePair[1]).length > 0) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return false;
    };
    IO_Themes.prototype.setCookie = function (value, optionalCookieName) {
        if (optionalCookieName === void 0) { optionalCookieName = null; }
        var cookieName = optionalCookieName ? optionalCookieName : this.settings.storageKey;
        var cookieMaxAge = this.settings.cookieDurationInSeconds;
        document.cookie = cookieName + "=" + value + "; max-age=" + cookieMaxAge;
        return true;
    };
    IO_Themes.prototype.setTheme = function (theme) {
        if (!theme) {
            return false;
        }
        // Add class to <body>
        var bodyClassList = window.document.body.classList;
        var themesToRemove = __spreadArray([], this.settings.themes, true).filter(function (themeItem) { return themeItem != theme; });
        for (var _i = 0, themesToRemove_1 = themesToRemove; _i < themesToRemove_1.length; _i++) {
            var possibleTheme = themesToRemove_1[_i];
            bodyClassList.remove(possibleTheme);
        }
        if (!bodyClassList.contains(theme)) {
            bodyClassList.add(theme);
        }
        // Store current theme
        switch (this.settings.storage) {
            case "localStorage":
                if ("undefined" !== typeof (Storage)) {
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
    };
    IO_Themes.prototype.switchTheme = function () {
        var _a;
        var themes = __spreadArray([], this.settings.themes, true);
        var currentTheme = (_a = this.getActiveTheme()) !== null && _a !== void 0 ? _a : this.settings.defaultTheme;
        var currentThemeIndex = themes.indexOf(currentTheme);
        var nextThemeIndex = (currentThemeIndex >= 0 && currentThemeIndex + 1 < themes.length) ? currentThemeIndex + 1 : 0;
        this.setTheme(themes[nextThemeIndex]);
    };
    IO_Themes.prototype.getActiveTheme = function () {
        var themes = __spreadArray([], this.settings.themes, true);
        for (var _i = 0, themes_1 = themes; _i < themes_1.length; _i++) {
            var theme = themes_1[_i];
            if (window.document.body.classList.contains(theme)) {
                return theme;
            }
        }
        return undefined;
    };
    return IO_Themes;
}());
//# sourceMappingURL=IO.Themes.js.map