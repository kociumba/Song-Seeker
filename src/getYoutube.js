import { chromium } from 'playwright';

async function getYoutube(searchTarget, artist) {
    const browser = await chromium.launch({
        headless: true
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
    await page.screenshot({ path: 'coockies bypass.png' });

    // fuck coockies
    // try {
    //     // await page.getByLabel('Accept the use of cookies and other data for the purposes described').click();
    //     // await page.getByText('Accept all').click();
    //     // await page.getByRole('button').nth(3).click();
    // } catch (error) {
    //     console.warn('Could not click I Accept button, continuing...');
    // }
    await page.screenshot({ path: 'search.png' });
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill(searchTarget + " " + artist);
    await page.getByPlaceholder('Search').press('Enter');
    // await page.getByText('2:36 2:36 Now playing Hardwell feat. Bright Lights - Shotgun (It Ain\'t Over)').click();
    // check first 3 links for match
    try {
        await page.getByRole('link', { name: searchTarget, exact: false }).nth(1).click({ timeout: 1000 });
    } catch (error) {
        // console.warn('firs result does not match');
    }
    try {
        await page.getByRole('link', { name: searchTarget, exact: false }).nth(2).click({ timeout: 1000 });
    } catch (error) {
        // console.warn('second result does not match');
    }
    try {
        await page.getByRole('link', { name: searchTarget, exact: false }).nth(3).click({ timeout: 1000 });
    } catch (error) {
        // console.warn('third result does not match');
    }
    /** @type {string} */
    let url = page.url();
    console.log(page.url());

    // ---------------------
    await context.close();
    await browser.close();

    return url
};

export default getYoutube;