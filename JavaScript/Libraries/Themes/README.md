# Theme and light/dark modes library
TypeScript and ES6 source code available.
## Usage
1. Load `IO.Themes.js` in file
    ```
    <script type="text/javascript" src="path/to/IO.Themes.js" />
    ```
2. Initialize the theme selector with this script: 
    ```javascript
    window.IO_Themes = new IO_Themes({
        storageKey: "io_theme",
        storage: "localStorage",
        defaultTheme: "light",
        defaultDarkTheme: "dark",
        themes: ["auto", "dark", "light"],
        cookieDurationInSeconds: 31536000,
    });

    document.querySelectorAll(".btn-theme-switch").forEach( (button) => {
        button.addEventListener("click", () => window.IO_Themes.switchTheme() );
    });
    ```
## Methods available
### getActiveTheme()
Return the active theme.
### setTheme("themeName")
Set active theme to "themeName".
### switchTheme()
Switch to the next theme after the current theme, in the settings.themes array.