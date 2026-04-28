import { Page, expect } from '@playwright/test';
import { AccountSelectors } from '../selectors/accountSelectors';
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
     * Click the Refresh button to reload the list.
     */
    async refresh(): Promise<void> {
        await expect(this.sel.btnRefresh).toBeVisible();
        await this.sel.btnRefresh.click();
    }

  
 }