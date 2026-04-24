import { Page, expect } from '@playwright/test';
import { productSelectors } from '../selectors/productSelectors';

export class ITGBProductsPage {
    private readonly sel: ReturnType<typeof productSelectors>;

    constructor(private readonly page: Page) {
        this.sel = productSelectors(page);
    }

    async openProductsTab() {
        await this.sel.productsTab.click();
        await expect(this.sel.productsHeading).toBeVisible();
    }

    async selectAllProducts() {
        await this.sel.btnSelectListView.click();
        await this.sel.optionAllProducts.click();
    }

    async verifyColumnHeaders() {
        await expect(this.sel.columnProductName).toBeVisible();
        await expect(this.sel.columnUPCCode).toBeVisible();
        await expect(this.sel.columnProductFamily).toBeVisible();
        await expect(this.sel.columnDescription).toBeVisible();
        await expect(this.sel.btnNew).toBeVisible();
    }

    async searchProduct(productName: string): Promise<boolean> {
        await this.sel.productSearchBox.click();
        await this.sel.productSearchBox.fill(productName);
        await this.sel.productSearchBox.press('Enter');
        return this.sel.searchedProduct(productName).isVisible().catch(() => false);
    }

    async openListViewControls() {
        await expect(this.sel.btnListViewControls).toBeVisible();
        await this.sel.btnListViewControls.click();
    }

    async refresh() {
        await expect(this.sel.btnRefresh).toBeVisible();
        await this.sel.btnRefresh.click();
    }

    async openSelectListDisplay() {
        await expect(this.sel.btnSelectListDisplay).toBeVisible();
        await this.sel.btnSelectListDisplay.click();
    }

    async sortByColumn(columnName: string, sortOrder: 'asc' | 'desc') {
        await this.sel.btnColumnSort.click();
        await this.sel.cboSelectColumn.click();
        await this.sel.columnOption(columnName).click();

        if (sortOrder === 'asc') {
            await this.sel.radioAscending.click({ force: true });
        } else {
            await this.sel.radioDescending.click({ force: true });
        }

        const isEnabled = await this.sel.btnApply.isEnabled();

        if (!isEnabled) {
            console.log(`✔ Skipped sorting → "${columnName}" is already sorted (${sortOrder}).`);
            return;
        }

        await expect(this.sel.btnApply).toBeVisible();
        await this.sel.btnApply.click();
        console.log(`✔ Sorted by ${columnName} (${sortOrder})`);
    }
}