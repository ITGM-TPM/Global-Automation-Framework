import { Page, expect } from '@playwright/test';
import { selectors } from '../selectors/commonSelector';


// ── String Format Helper ───────────────────────────────────────────────────────
export const stringFormat = (str: string, ...args: any[]) =>
    str.replace(/{(\d+)}/g, (match, index) => args[index]?.toString() ?? '');


// ── View Verification Flow ─────────────────────────────────────────────────────
export async function verifySystemViews(
    page: Page,
    expectedViews: string[]
): Promise<void> {
    try {
        const viewSelector = page.locator(selectors.viewSelectors.ViewSelector);
        await viewSelector.waitFor({ state: 'visible', timeout: 10_000 });
        await viewSelector.click();
        await expect(viewSelector).toBeVisible();

        for (const view of expectedViews) {
            const viewOption = page.locator(
                stringFormat(selectors.viewSelectors.ViewName, view)
            ).first();
            await viewOption.waitFor({ state: 'visible', timeout: 5_000 });
            await expect(viewOption).toBeVisible();
            await expect(viewOption).toHaveText(view);
        }

        await viewSelector.click();

    } catch (error) {
        console.error('[verifySystemViews] ❌ Error:', error);
        throw error;
    }
}


// ── Column Verification ────────────────────────────────────────────────────────
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
        }
    } catch (error) {
        console.error('[verifyColumns] ❌ Error:', error);
        throw error;
    }
}


// ── View Selection ─────────────────────────────────────────────────────────────
export async function viewSelection(
    page: Page,
    viewName: string,
): Promise<void> {
    try {
        const viewSelector = page.locator(
            stringFormat(selectors.viewSelectors.ViewSelector)
        );
        await page.waitForTimeout(5000);
        await viewSelector.waitFor({ state: 'visible', timeout: 10_000 });
        await viewSelector.click();
        await expect(viewSelector).toBeVisible();
        await waitUntilAppIdle(page);

        const viewOption = page.locator(
            stringFormat(selectors.viewSelectors.ViewName, viewName)
        );
        await viewOption.first().click({ timeout: 10_000 });
        await waitUntilAppIdle(page);
        console.log(`[viewSelection] ✅ Selected view: "${viewName}"`);

    } catch (error) {
        console.error(`[viewSelection] ❌ Error selecting view "${viewName}":`, error);
        throw error;
    }
}


// ── Wait Until App Idle ────────────────────────────────────────────────────────
export async function waitUntilAppIdle(
    page: Page,
    locator?: string
): Promise<void> {
    try {
        await page.waitForLoadState('domcontentloaded', { timeout: 10_000 });
    } catch {
        // continue if timed out
    }

    try {
        const contentSelector = locator ?? [
            'table[role="grid"]',
            '.slds-table',
            'lightning-datatable',
            '.slds-page-header',
        ].join(',');

        await page.waitForSelector(contentSelector, {
            state: 'visible',
            timeout: 15_000
        });
    } catch {
        // continue if timed out
    }
}


// ── Column Sort ────────────────────────────────────────────────────────────────
export async function verifySortingOrder(
    page: Page,
    columnName: string,
    sortOrder: 'Ascending' | 'Descending',
    action: 'Apply' | 'Cancel' | 'Clear'
): Promise<void> {
    try {
        const btnColumnSort = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonByTitle, 'Column sort')
        );
        await expect(btnColumnSort).toBeVisible();

        const btnClear = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, 'Clear')
        );
        await btnColumnSort.waitFor({ state: 'visible', timeout: 10_000 });
        await btnColumnSort.click();
        await btnClear.click();

        const cboSelectColumn = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicDropdownByLabel, 'Select a column')
        );
        await cboSelectColumn.waitFor({ state: 'visible', timeout: 10_000 });
        await cboSelectColumn.click();

        const columnOption = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicDropdownOption, columnName)
        );
        await columnOption.waitFor({ state: 'visible', timeout: 5_000 });
        await columnOption.click();
        await page.waitForTimeout(3000);

        const radioOption = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicRadioOption, sortOrder)
        );
        await radioOption.waitFor({ state: 'visible', timeout: 5_000 });
        await expect(radioOption).toBeVisible();
        await radioOption.click({ force: true });

        const btnAction = page.locator(
            stringFormat(selectors.dynamicSelector.DynamicButtonInContainer, action)
        );

        const isActionBtnVisible = await btnAction.isVisible();

        if (!isActionBtnVisible) {
            console.warn(`[verifySortingOrder] ⚠️ "${action}" button not visible. Retrying...`);

            await cboSelectColumn.waitFor({ state: 'visible', timeout: 10_000 });
            await cboSelectColumn.click();
            await columnOption.waitFor({ state: 'visible', timeout: 5_000 });
            await columnOption.click();
            await page.waitForTimeout(3000);

            await radioOption.waitFor({ state: 'visible', timeout: 5_000 });
            await radioOption.click({ force: true });

            await expect(
                btnAction,
                `[verifySortingOrder] "${action}" button still not visible after retry.`
            ).toBeVisible({ timeout: 5_000 });
        } else {
            await expect(
                btnAction,
                `[verifySortingOrder] "${action}" button should be visible.`
            ).toBeVisible({ timeout: 5_000 });
        }

        await btnAction.click();

        if (action === 'Apply') {
            const ariaSortValue = sortOrder === 'Ascending' ? 'ascending' : 'descending';
            await page.waitForSelector(
                `th[aria-label="${columnName}"][aria-sort="${ariaSortValue}"]`,
                { state: 'attached', timeout: 15_000 }
            );
            console.log(`[verifySortingOrder] ✅ Sort confirmed: "${columnName}" → ${sortOrder}`);
        }

    } catch (error) {
        console.error(
            `[verifySortingOrder] ❌ Failed — column: "${columnName}", order: "${sortOrder}", action: "${action}"`,
            error
        );
        throw error;
    }
}


// ── Search In View ─────────────────────────────────────────────────────────────
export async function searchInView(
    page: Page,
    searchValue: string,
): Promise<void> {
    const searchBox = page.locator(stringFormat(selectors.dynamicSelector.SearchInput));
    await searchBox.waitFor();
    await searchBox.fill(searchValue);
    await page.keyboard.press('Enter');
    await expect(searchBox).toHaveValue(searchValue);
    console.log("Search Value", searchValue)
}


// ── Login As User ──────────────────────────────────────────────────────────────
/**
 * Reusable utility — Login As User in Salesforce
 *
 * @param page     - Playwright Page instance
 * @param username - Dynamic username to search and login as
 */
export async function loginAsUser(page: Page, username: string): Promise<void> {
    try {
        // Click global search button ────────────────────────────────
        const btnGlobalSearch = page.locator(
            selectors.dynamicSelector.GlobalSearchButton
        );
        await page.locator("//button[@aria-label='Search']").click();
        await btnGlobalSearch.fill(username);
        await btnGlobalSearch.press('Enter');

        // Click "User Detail" option ────────────────────────────────
        const btnUserDetail = page.locator(stringFormat(selectors.dynamicSelector.DynamicUserOption, 'User Detail'));
        await btnUserDetail.waitFor({ state: 'visible', timeout: 15_000 });
        await expect(btnUserDetail,`[loginAsUser] "User Detail" for "${username}" should be visible`).toBeVisible();
        await btnUserDetail.click();
        //await waitUntilAppIdle(page);    
        // Click "Login" button inside iframe ─────────────────────────
        const iframe = page.frameLocator(selectors.dynamicSelector.IframeLocator);
        const btnLogin = iframe.getByRole('row', { name: selectors.dynamicSelector.UserDetailRowInIframe })
            .locator(selectors.dynamicSelector.LoginButtonInIframe);

        await expect( btnLogin,'[loginAsUser] Login button inside iframe should be visible').toBeVisible({ timeout: 25_000 });
        await btnLogin.click();

        //  Assert "Logged in as " ───────────────────────────
        const txtLoggedIn = page.getByText(stringFormat(selectors.dynamicSelector.LoggedInAsText, username));
        await expect(txtLoggedIn,`[loginAsUser] Page should show "Logged in as ${username}"`).toBeVisible({ timeout: 15_000 });

        console.log(`[loginAsUser] Successfully logged in as "${username}".`);

    } catch (error) {
        console.error(`[loginAsUser] Failed to login as "${username}".`, error);
        throw error;
    }
}