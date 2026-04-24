import { test } from '../fixtures/itgbFixtures';

test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === 'passed' ? '✔' : '❌';
    console.log(`${icon} Test ${testInfo.status}: ${testInfo.title}`);
});

// ✅ { page } hataya, { productPage } fixture inject kiya
test('ITGB Products View', async ({ productPage }) => {

    // ✅ Login step hataya — fixture already karta hai

    await test.step('Open Products tab and verify it loads', async () => {
        await productPage.openProductsTab();
    });

    await test.step('Select All Products list view', async () => {
        await productPage.selectAllProducts();
    });

    await test.step('Verify column headers and New button are visible', async () => {
        await productPage.verifyColumnHeaders();
    });

    await test.step('Search for a product and log result', async () => {
        const found = await productPage.searchProduct('Winston Gold');
        console.log(found ? 'Product found' : 'Product NOT found');
    });

    await test.step('Reopen Products tab and open List View Controls', async () => {
        await productPage.openProductsTab();
        await productPage.openListViewControls();
    });

    await test.step('Refresh the Products list', async () => {
        await productPage.refresh();
    });

    await test.step('Open Select List Display', async () => {
        await productPage.openSelectListDisplay();
    });

    await test.step('Select All Products and sort by Product Name descending', async () => {
        await productPage.selectAllProducts();
        await productPage.sortByColumn('Product Name', 'desc');
    });

    await test.step('Sort by Description ascending', async () => {
        await productPage.sortByColumn('Description', 'asc');
    });
});