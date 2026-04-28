import { test, expect }      from '../fixtures/itgbFixtures';
import { getPromotionName, getPromotionStartDate } from '../src/utils/dataUtils';
import { verifySystemViews, verifyColumns, searchInView, loginAsUser } from '../utils/commonLogic'; 

test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === 'passed' ? '✅' : '❌';
    console.log(`${icon} Test ${testInfo.status}: ${testInfo.title}`);
});


test('ITGB Advanced Promotions - End to End', async ({ promotionPage, page }) => {

    await test.step('Open Advanced Promotions tab and verify it loads', async () => {
        await promotionPage.openPromotionTab();
    });

    await test.step('Verify System Views in Dropdown', async () => {
        const viewsToVerify = [
            'All',
            'Recently Viewed (Pinned list)',
        ];
        await verifySystemViews(page, viewsToVerify);
    });

    await test.step('Verify all column headers are visible', async () => {
        const columnsToVerify = [
            'Promotion Name',
            'Name',
            'Promotion Template',
            'Promotion Start Date',
            'Promotion End Date',
            'Status',
            'Anchor Customer',
            'Record Type',
            'Sales Org',
        ];
        await verifyColumns(page, columnsToVerify);
    });

    await test.step('Search for Account Name and confirm row appears', async () => {
        await searchInView(page, 'P-00647563');
    });
await page.pause();
    await test.step('Login as Test Sales Planner', async () => {
        await loginAsUser(page, 'Test Sales Planner'); 
    });

    await test.step('Create a new TPM Promotion', async () => {
        const promotionName = getPromotionName();
        const startDate     = getPromotionStartDate();
        await promotionPage.createNewTPMPromotion(promotionName, startDate);
        console.log(`[Promotion] ✅ Created: "${promotionName}" | Start: ${startDate}`);
    });

});