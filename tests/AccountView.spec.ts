import { test, expect } from '../fixtures/itgbFixtures';
import {
    verifySystemViews,
    verifyColumns,
    viewSelection, 
    verifySortingOrder,          
    waitUntilAppIdle,
    stringFormat,
    searchInView
} from '../utils/commonLogic';
import{ selectors } from'../selectors/commonSelector'

const SEARCH_ACCOUNT_NAME = '7-Eleven';

test('ITGB Accounts Validate All Active Accounts system view', async ({ accountsPage, page }) => {

    await test.step('Open Accounts tab', async () => {
        await accountsPage.openAccountsTab();
    });

    await test.step('Verify System Views in Dropdown', async () => {
        const viewsToVerify = [
            '01. My Active Accounts',
            '02. My Team Accounts',
            '03. My Inactive Accounts',
            '13. All Accounts',
            'All Accounts',
        ];
        await verifySystemViews(page, viewsToVerify);
    });
    await test.step('Select "13. All Accounts" list view', async () => {
        await page.waitForTimeout(7000);
        await viewSelection(page, '13. All Accounts');
    });

    await test.step('Verify all column headers are visible', async () => {
        const columnsToVerify = [
            'Account Name',
            'CRS Number',
            'Territory',
            'Billing City',
            'Billing State/Province',
            'Parent Account',
        ];
        await verifyColumns(page, columnsToVerify);
    });
    
    await test.step('Validate Column Sorting', async () => {
        const btnCancel = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, 'Cancel')
        );
        // Ascending sort → Cancel (no changes)
        await verifySortingOrder(page, 'Account Name', 'Ascending', 'Cancel');

        // Descending sort → Apply
        await verifySortingOrder(page, 'CRS Number', 'Descending', 'Apply');

        // Open dialog → Apply 
        await verifySortingOrder(page, 'Account Name', 'Ascending', 'Apply');

        // Clear existing sort
        await verifySortingOrder(page, 'Account Name', 'Ascending', 'Clear'); 
        
        //Close Column Sort box
         await page.locator(stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, 'Cancel')).click();
    });

    await test.step(`Search for "${SEARCH_ACCOUNT_NAME}" and confirm row appears`, async () => {
    await searchInView(page, "7-Eleven");
    });

});