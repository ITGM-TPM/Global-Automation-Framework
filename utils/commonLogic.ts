import { Page, expect } from '@playwright/test';
import { ITGBAccountsPage } from '../pages/ITGBAccountsPage';
import { selectors } from '../selectors/commonSelector';

/** Identifies which Salesforce list view to activate. */
export type AccountListView = 'all' | 'myActive';



/** Options controlling how the accounts list is opened. */
export interface OpenAccountsListOptions {
    listView?: AccountListView;
}

// ── String Format Helper ───────────────────────────────────────────────────────
export const stringFormat = (str: string, ...args: any[]) =>
    str.replace(/{(\d+)}/g, (match, index) => args[index]?.toString() ?? '');


// ── Search Flows ───────────────────────────────────────────────────────────────
export async function searchAndVerifyAccount(
    accountsPage: ITGBAccountsPage,
    accountName: string
): Promise<void> {
    //await accountsPage.searchAccounts(accountName);
}

// ── List Controls Flows ────────────────────────────────────────────────────────
export async function exerciseListControls(accountsPage: ITGBAccountsPage): Promise<void> {
  //  await accountsPage.openListViewControls();
    await accountsPage.refresh();
    await accountsPage.openSelectListDisplay();
}

// ── View Verification Flow ─────────────────────────────────────────────────────
export async function verifySystemViews(
    page: Page,
    expectedViews: string[]
): Promise<void> {
    try {
        // Step 1: Dropdown button click 
        const viewSelector = page.locator(
            selectors.viewSelectors.ViewSelector 
        );
        await viewSelector.waitFor({ state: 'visible', timeout: 10_000 });
        await viewSelector.click();
        console.log('[verifySystemViews] Dropdown opened.');

        // Step 2: every view verify 
        for (const view of expectedViews) {
            const viewOption = page.locator(
                stringFormat(selectors.viewSelectors.ViewName, view) 
            ).first();

            await viewOption.waitFor({ state: 'visible', timeout: 5_000 });
            await expect(viewOption).toBeVisible();
            console.log(`[verifySystemViews] Verified view: "${view}"`);
        }

        // Step 3: Dropdown close 
        await viewSelector.click();
        console.log('[verifySystemViews] Dropdown closed.');

    } catch (error) {
        console.error('[verifySystemViews] Error:', error);
        throw error;
    }
}

/**
 * Verifies Promotion grid column headers using aria-label.
 * No scroll needed — aria-label is always in DOM even if visually truncated.
 *
 * @param page            - Playwright Page instance
 * @param expectedColumns - Array of exact column aria-label names to verify
 */
export async function verifyColumns(
    page: Page,
    expectedColumns: string[]
): Promise<void> {
    try {
        for (const columnName of expectedColumns) {
            const columnHeader = page.locator(
                stringFormat(selectors.gridSelectors.ColumnHeader, columnName)
            );

            await columnHeader.waitFor({ state: 'visible', timeout: 10_000 });
            await expect(columnHeader).toBeVisible();
            console.log(`[verifyColumns] Column verified: "${columnName}"`);
        }
    } catch (error) {
        console.error('[verifyColumns] Error:', error);
        throw error;
    }
}
/**
 * Selects a specific list view from the dropdown on any Entity page.
 *
 * @param page     - Playwright Page instance
 * @param viewName - Exact name of the view to select (e.g. '13. All Accounts')
 */
export async function viewSelection(
    page: Page,
    viewName: string,
): Promise<void> {
    try {
        // Step 1: Wait for dropdown button and click
        const viewSelector = page.locator(
            stringFormat(selectors.viewSelectors.ViewSelector)
        );
        await viewSelector.waitFor({ state: 'visible', timeout: 10_000 });
        await viewSelector.click();
        await waitUntilAppIdle(page);
        console.log(`[viewSelection] Dropdown opened.`);

        // Step 2: Click the specific view option
        const viewOption = page.locator(
            stringFormat(selectors.viewSelectors.ViewName, viewName)
        );
        await viewOption.first().click({ timeout: 10_000 });
        await waitUntilAppIdle(page);
        console.log(`[viewSelection] Selected view: "${viewName}"`);

    } catch (error) {
        console.error(`[viewSelection] Error selecting view "${viewName}":`, error);
        throw error;
    }
}

/**
 * Waits until Salesforce page is fully loaded and idle.
 * Does NOT rely on spinner or networkidle — both unreliable in Salesforce.
 * Waits for actual page content (table/grid) to appear.
 *
 * @param page    - Playwright Page instance
 * @param locator - Optional: specific element to wait for (default: SF table/grid)
 */
export async function waitUntilAppIdle(
    page: Page,
    locator?: string
): Promise<void> {

    // Strategy 1: domcontentloaded
    try {
        await page.waitForLoadState('domcontentloaded', { timeout: 10_000 });
        console.log('[waitUntilAppIdle]  DOM loaded.');
    } catch (e: any) {
        console.log('[waitUntilAppIdle]  DOM load timed out, continuing...');
    }

    // Strategy 2: Wait for actual SF page content — table/grid/list visible
    try {
        const contentSelector = locator ?? [
            'table[role="grid"]',           // Salesforce standard list view table
            '.slds-table',                  // SLDS table
            'lightning-datatable',          // Lightning datatable
            '.slds-page-header',            // Page header — always present
        ].join(',');

        await page.waitForSelector(contentSelector, {
            state: 'visible',
            timeout: 15_000
        });
        console.log('[waitUntilAppIdle]  Page content visible.');
    } catch (e: any) {
        console.log('[waitUntilAppIdle] Content wait timed out, continuing...');
    }
}

export async function verifySortingOrder(
    page: Page,
    columnName: string,
    sortOrder: 'Ascending' | 'Descending',
    action: 'Apply' | 'Cancel' | 'Clear'
): Promise<void> {
    try {
        // ── Step 1: Click "Column sort" button ────────────────────────────────
        const btnColumnSort = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonByTitle, 'Column sort')
        );
        const btnClear = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, 'Clear')
        );
        await btnColumnSort.waitFor({ state: 'visible', timeout: 10_000 });
        await btnColumnSort.click();
        await btnClear.click();

        console.log('[applyColumnSort] Column Sort dialog opened.');

        // ── Step 2: Click to open the "Select a column" combobox ─────────────
        const cboSelectColumn = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicDropdownByLabel, 'Select a column')
        );
        await cboSelectColumn.waitFor({ state: 'visible', timeout: 10_000 });
        await cboSelectColumn.click();

        console.log('[applyColumnSort] Column dropdown opened.');

        // ── Step 2b: Click the matching option from the listbox ───────────────
        const columnOption = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicDropdownOption, columnName)
        );
        await columnOption.waitFor({ state: 'visible', timeout: 5_000 });
        await columnOption.click();
        console.log(`[applyColumnSort] Column selected: "${columnName}"`);

        // ── Step 3: Select sort order radio ───────────────────────────────────
        const radioOption = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicRadioOption, sortOrder)
        );
        await radioOption.waitFor({ state: 'visible', timeout: 5_000 });
        await radioOption.click({ force: true });
        console.log(`[applyColumnSort] Sort order selected: "${sortOrder}"`);

        // ── Step 4: Click action button (Apply / Cancel / Clear) ──────────────
        const btnAction = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, action)
        );
        await btnAction.waitFor({ state: 'visible', timeout: 5_000 });
        await btnAction.click();
        console.log(`[applyColumnSort] Action clicked: "${action}"`);

        // ── Step 5: If Apply — wait for grid to confirm sort ──────────────────
        if (action === 'Apply') {
            const ariaSortValue = sortOrder === 'Ascending' ? 'ascending' : 'descending';
            await page.waitForSelector(
                `th[aria-label="${columnName}"][aria-sort="${ariaSortValue}"]`,
                { state: 'attached', timeout: 15_000 }
            );
            console.log(`[applyColumnSort] ✔ Sort confirmed: "${columnName}" → ${sortOrder}`);
        }
        

    } catch (error) {
        console.error(
            `[applyColumnSort] Failed — column: "${columnName}", order: "${sortOrder}", action: "${action}"`,
            error
        );
        throw error;
    }
}


