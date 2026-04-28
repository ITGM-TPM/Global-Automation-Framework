import { test, expect }      from '../fixtures/itgbFixtures';
import { getPromotionName, getPromotionStartDate } from '../src/utils/dataUtils';

test.afterEach(async ({}, testInfo) => {
    const icon = testInfo.status === 'passed' ? '✅' : '❌';
    console.log(`${icon} Test ${testInfo.status}: ${testInfo.title}`);
});


test('ITGB Advanced Promotions - End to End', async ({ promotionPage, page }) => {

    await test.step('Open Advanced Promotions tab and verify it loads', async () => {
        await promotionPage.openPromotionTab();

    await test.step('Create a new TPM Promotion', async () => {
        const promotionName = getPromotionName();
        const startDate     = getPromotionStartDate();
        await promotionPage.createNewTPMPromotion(promotionName, startDate);
        console.log(`[Promotion] ✅ Created: "${promotionName}" | Start: ${startDate}`);
    });

    });    
});