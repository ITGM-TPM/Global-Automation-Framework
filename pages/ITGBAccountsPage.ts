import { Page, expect } from '@playwright/test';
import { AccountSelectors } from '../selectors/accountSelectors';

// ── Types ──────────────────────────────────────────────────────────────────────

//export type SortOrder = 'asc' | 'desc';

export class ITGBAccountsPage {

    private readonly sel: AccountSelectors;

    constructor(private readonly page: Page) {
        this.sel = new AccountSelectors(page);
    }

   
    /**
     * Click the Accounts tab and confirm the page heading is visible.
     */
    async openAccountsTab(): Promise<void> {
        await this.sel.accountsTab.click();
        await expect(this.sel.accountHeading).toBeVisible();
    }

   
    /**
     * Switch to the "My Active Accounts" list view.
     */
    async selectMyActiveAccounts(): Promise<void> {
        await this.sel.btnSelectListView.click();
        await this.sel.optionMyActiveAccounts.click();
    }


    /**
     * Click the Refresh button to reload the list.
     */
    async refresh(): Promise<void> {
        await expect(this.sel.btnRefresh).toBeVisible();
        await this.sel.btnRefresh.click();
    }

    /**
     * Open the Select List Display panel.
     */
    async openSelectListDisplay(): Promise<void> {
        await expect(this.sel.btnSelectListDisplay).toBeVisible();
        await this.sel.btnSelectListDisplay.click();
    }
 }