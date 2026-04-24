
import { Page, Locator } from "@playwright/test";

export class FooterPage {
    readonly page: Page;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.footer = page.locator('#footer');
    }
}
