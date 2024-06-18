const { chromium } = require('playwright');
const { headless, timeout } = require('./config');

let found = true

module.exports = async function getYoutube(searchTarget, artist) {
    const browser = await chromium.launch({
        headless: headless
    });
    const context = await browser.newContext({
        Permissions: [],
    });

    // coockie prompt bypass for youtube
    await context.addCookies([{
        name: 'SOCS',
        value: 'CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg',
        domain: 'www.youtube.com',
        path: '/',
    }]);

    const page = await context.newPage();
    await page.goto('https://www.youtube.com/?hl=en&gl=EN');
    // await page.screenshot({ path: 'coockies bypass.png' });

    // fuck coockies
    // try {
    //     // await page.getByLabel('Accept the use of cookies and other data for the purposes described').click();
    //     // await page.getByText('Accept all').click();
    //     // await page.getByRole('button').nth(3).click();
    // } catch (error) {
    //     console.warn('Could not click I Accept button, continuing...');
    // }
    // await page.screenshot({ path: 'search.png' });
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill(searchTarget + " " + artist);
    await page.getByPlaceholder('Search').press('Enter');
    // await page.getByText('2:36 2:36 Now playing Hardwell feat. Bright Lights - Shotgun (It Ain\'t Over)').click();
    // check first 3 links for match
    for (let i = 1; i <= 3; i++) {
        try {
            await page.getByRole('link', { name: searchTarget, exact: false }).nth(i).click({ timeout: timeout });
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
        console.log("No results found on youtube");
    }

    // ---------------------
    await context.close();
    await browser.close();

    return url
};

// export default getYoutube;