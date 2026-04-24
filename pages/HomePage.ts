import { Page, Locator, expect } from '@playwright/test';

export class HomeCardHeader {
    readonly page: Page;
    readonly headerSpan: Locator;

    constructor(page: Page) {
        this.page = page;

        // CSS selector with escaped colon in the id and a direct child span
        this.headerSpan = page.locator('#homeCardHeader_1950\\:0 > span');
    }


    async getText(): Promise<string> {
        await expect(this.headerSpan).toBeVisible();
        return this.headerSpan.innerText();
    }


    async click(): Promise<void> {
        await expect(this.headerSpan).toBeVisible();
        await this.headerSpan.click();
    }

    async isVisible(): Promise<boolean> {
        return await this.headerSpan.isVisible();
    }
}