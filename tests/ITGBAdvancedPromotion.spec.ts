// import { test, expect } from '../fixtures/itgbFixtures';
// import { getPromotionName, getPromotionStartDate } from '../src/utils/dataUtils';
// import { verifySystemViews }  from '../utils/commonLogic';


// test.afterEach(async ({}, testInfo) => {
//     const icon = testInfo.status === 'passed' ? '✔' : '❌';
//     console.log(`${icon} Test ${testInfo.status}: ${testInfo.title}`);
// });

// test('ITGB Advanced Promotions - End to End', async ({ promotionPage }) => {

//     await test.step('Open Advanced Promotions tab and verify it loads', async () => {
//         console.log('➡️ Step: Open Advanced Promotions tab');
//         await promotionPage.openPromotionTab();
//         console.log('✅ Completed: Open Advanced Promotions tab');
//     });

//     // await test.step('Select All Promotions list view', async () => {
//     //     console.log('➡️ Step: Select All Promotions');
//     //     await promotionPage.selectAll();
//     //     console.log('✅ Completed: Select All Promotions');
//     // });

//    await test. step('ITGB Accounts - Verify System Views in Dropdown', async ({ promotionPage, page }) => {
//     await promotionPage.openAccountsTab();
//     await test.step('Verify all expected system views are present in dropdown', async () => {
//         const viewsToVerify = [
//             'Recently Viewed',
//             'All Other Lists',
           
//         ];
//         await verifySystemViews(page, viewsToVerify);
//     });
// });

//     await test.step('Verify column headers are visible', async () => {
//         console.log('➡️ Step: Verify column headers');
//         await promotionPage.verifyColumnHeaders();
//         console.log('✅ Completed: Verify column headers');
//     });

//     await test.step('Search for a promotion and log result', async () => {
//         console.log('➡️ Step: Search promotion');
//         const found = await promotionPage.searchPromotion('P-00647578');
//         console.log(found ? '✅ Promotion found' : '❌ Promotion NOT found');
//     });

//     await test.step('Login as Test Sales Planner', async () => {
//         console.log('➡️ Step: Login as Test Sales Planner');
//         await promotionPage.loginTestSalesPlanner();
//         console.log('✅ Completed: Login');
//     });

//     await test.step('Create a new TPM Promotion', async () => {
//         console.log('➡️ Step: Create TPM Promotion');
//         const promotionName = getPromotionName();
//         const startDate = getPromotionStartDate();

//         console.log(`📌 Promotion Name: ${promotionName}`);
//         console.log(`📅 Start Date: ${startDate}`);

//         await promotionPage.createNewTPMPromotion(promotionName, startDate);
//         console.log('✅ Completed: TPM Promotion creation');
//     });
// });


import { test, expect }      from '../fixtures/itgbFixtures';
import { getPromotionName, getPromotionStartDate } from '../src/utils/dataUtils';
import { verifySystemViews, verifyColumns  } from '../utils/commonLogic';

test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === 'passed' ? '✔' : '❌';
    console.log(`${icon} Test ${testInfo.status}: ${testInfo.title}`);
});

test('ITGB Advanced Promotions - End to End', async ({ promotionPage, page }) => {

    await test.step('Open Advanced Promotions tab and verify it loads', async () => {
        console.log('➡️ Step: Open Advanced Promotions tab');
        await promotionPage.openPromotionTab();
        console.log('✅ Completed: Open Advanced Promotions tab');
    });
await page.pause();
    await test.step('Verify System Views in Dropdown', async () => {
        const viewsToVerify = [
            'All',
            'Recently Viewed (Pinned list)',
        ];
        await verifySystemViews(page, viewsToVerify);
    });

    await test.step('Verify all column headers are visible', async () => {
        const columnsToVerify = [
            'Promotion Name',       // index 2 — aria-label="Promotion Name"
            'Name',                 // index 3 — aria-label="Name"
            'Promotion Template',   // index 4 — aria-label="Promotion Template"
            'Promotion Start Date', // index 5 — aria-label="Promotion Start Date"
            'Promotion End Date',   // index 6 — aria-label="Promotion End Date"
            'Status',               // index 7 — aria-label="Status"
            'Anchor Customer',      // index 8 — aria-label="Anchor Customer"
            'Record Type',          // index 9 — aria-label="Record Type"
            'Sales Org',            // index 10 — aria-label="Sales Org"
        ];
        await verifyColumns(page, columnsToVerify);
    });

   
    await test.step('Search for a promotion and log result', async () => {
        console.log('➡️ Step: Search promotion');
        const found = await promotionPage.searchPromotion('P-00647578');
        console.log(found ? '✅ Promotion found' : '❌ Promotion NOT found');
    });

    await test.step('Login as Test Sales Planner', async () => {
        console.log('➡️ Step: Login as Test Sales Planner');
        await promotionPage.loginTestSalesPlanner();
        console.log('✅ Completed: Login');
    });

    await test.step('Create a new TPM Promotion', async () => {
        console.log('➡️ Step: Create TPM Promotion');
        const promotionName = getPromotionName();
        const startDate     = getPromotionStartDate();
        console.log(`📌 Promotion Name: ${promotionName}`);
        console.log(`📅 Start Date: ${startDate}`);
        await promotionPage.createNewTPMPromotion(promotionName, startDate);
        console.log('✅ Completed: TPM Promotion creation');
    });
});