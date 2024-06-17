import { chromium } from 'playwright';

async function getSoundcloud(searchTarget, artist) {
    const browser = await chromium.launch({
        headless: true
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.soundcloud.com');
    try {
        await page.getByRole('button', { name: 'I Accept' }).click();
    } catch (error) {
        console.warn('Could not click I Accept button, continuing...');
    }
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').click();
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').fill(searchTarget + " " + artist);
    await page.locator('#content').getByPlaceholder('Search for artists, bands,').press('Enter');
    await page.getByRole('link', { name: searchTarget, exact: false }).nth(1).click();
    /** @type {string} */
    let url = page.url();
    console.log(page.url());

    // ---------------------
    await context.close();
    await browser.close();

    return url
};

export default getSoundcloud;