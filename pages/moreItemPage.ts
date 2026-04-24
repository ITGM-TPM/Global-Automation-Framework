import { Page, Locator, expect } from "@playwright/test";

export class MoreItem {
    readonly page: Page;
    readonly moreDropdown: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locator for the MORE dropdown button
        this.moreDropdown = page.locator('.more-item a span.slds-p-right_small');
    }

    async openMoreMenu() {
        await expect(this.moreDropdown).toBeVisible();
        await this.moreDropdown.click();
    }

    async selectProducts() {
        // Open MORE menu
        await this.openMoreMenu();

        // Select the "Products" menu item using text
        const productsOption = this.page.getByRole('menuitem', { name: 'Products' });

        await expect(productsOption).toBeVisible();
        await productsOption.click();
    }
}