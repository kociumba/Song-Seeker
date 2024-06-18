const { chromium } = require('playwright');

module.exports =  async function getSoundcloud(searchTarget, artist) {
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

    for (let i = 1; i <= 3; i++) {
        try {
            await page.getByRole('link', { name: searchTarget, exact: false }).nth(i).click({ timeout: 1000 });
            break;
        } catch (error) {
            // console.warn(`${i}th result does not match`);
        }
    }
    /** @type {string} */
    let url = page.url();
    console.log(page.url());

    // ---------------------
    await context.close();
    await browser.close();

    return url
};

// export default getSoundcloud;