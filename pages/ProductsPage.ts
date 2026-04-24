import { Page, Locator, expect } from "@playwright/test";

export class ProductsNav {
    readonly page: Page;
    readonly productsTab: Locator;

    constructor(page: Page) {
        this.page = page;

        this.productsTab = page.getByRole('link', { name: 'Products' });
    }

    async gotoProducts(page: Page) {
        // await page.waitForLoadState('networkidle');
        //  await expect(this.productsTab).toBeVisible();
        // await page.waitForLoadState('networkidle');
        await this.productsTab.click();
    }
}