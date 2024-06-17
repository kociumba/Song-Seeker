import { chromium } from 'playwright';

async function getYoutube(searchTarget, artist) {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.youtube.com');
    try {
        await page.getByLabel('Accept the use of cookies and other data for the purposes described').click();
        // await page.getByRole('button', { name: 'Accept All' }).click();
    } catch (error) {
        console.warn('Could not click I Accept button, continuing...');
    }
    await page.getByPlaceholder('Search').click();
    await page.getByPlaceholder('Search').fill(searchTarget + " " + artist);
    await page.getByPlaceholder('Search').press('Enter');
    // await page.getByText('2:36 2:36 Now playing Hardwell feat. Bright Lights - Shotgun (It Ain\'t Over)').click();
    await page.getByRole('link', { name: searchTarget, exact: false }).nth(1).click();
    /** @type {string} */
    let url = page.url();
    console.log(page.url());

    // ---------------------
    await context.close();
    await browser.close();

    return url
};

export default getYoutube;