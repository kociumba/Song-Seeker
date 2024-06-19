# Song-Seeker

A small app to get direct links for songs from various platforms from just the title 😎.

## Installation

Prebuilt binaries for:
- Windows
- Linux
- macOS

can be downloaded from [releases](https://github.com/kociumba/Song-Seeker/releases).

> [!IMPORTANT]
> Unfortunatly I can't package the playwright version of chromium with the app so you will still have to install playwright with 
>
> ```
> npx playwright install --with-deps chromium
> ```
>
> or any other way mentioned [on the playwright docs](https://playwright.dev/docs/intro#installing-playwright)

If you want to run the app from source you can use 
```
npm install
node ./src/song-seeker.js
``` 
