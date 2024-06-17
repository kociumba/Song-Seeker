import { chromium } from 'playwright';

async function getSoundcloud(searchTarget, artist) {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.soundcloud.com');

    // fuck coockies
    try {
        await page.getByRole('button', { name: 'I Accept' }).click();
    } catch (error) {
        console.warn('Could not click I Accept button, continuing...');
    }
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').click();
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').fill(searchTarget + " " + artist);
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').press('Enter');

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

export default getSoundcloud;