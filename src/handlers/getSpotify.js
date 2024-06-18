const { chromium } = require('playwright');
const { headless, timeout } = require('./config');

let found = true

/** @type {import('playwright').Browser} */
let browser
/** @type {import('playwright').BrowserContext} */
let context

module.exports = async function getSpotify(searchTarget, artist) {
    try {
        browser = await chromium.launch({
            headless: headless
        });
        context = await browser.newContext({
            Permissions: [],
        });
    } catch (error) {
        console.error("Playwright chromium could not be found, please install it with `npx install playwright` if you have node installed\nOr for more info go to https://playwright.dev/docs/intro#installing-playwright");
        process.exit(1);
    }
    const page = await context.newPage();
    await page.goto('https://open.spotify.com/');
    await page.getByRole('button', { name: 'Accept Cookies' }).click();
    await page.getByTestId('root').getByLabel('Search').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(searchTarget + " " + artist);
    for (let i = 1; i <= 3; i++) {
        try {
            await page.getByRole('link', { name: searchTarget, exact: false }).nth(i).click({ timeout: timeout });
            // await page.screenshot({ path: 'spotify click.png' });
            // await page.getByTestId('track-list').getByRole('link', { name: searchTarget, exact: false }).nth(i).click({ timeout: 1000 });
            break;
        } catch (error) {
            // console.warn(`${i}th result does not match`);
        }
        found = false
    }
    /** @type {string} */
    let url = page.url();
    if (found == true) {
        console.log(page.url());
    } else {
        console.log("No results found on spotify");
    }

    // ---------------------
    await context.close();
    await browser.close();

    return url
}

// export default getSpotify;