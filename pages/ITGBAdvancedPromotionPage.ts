import { Page, expect } from '@playwright/test';
import { promotionSelectors } from '../selectors/promotionSelectors';

export class ITGBAdvancedPromotionPage {
    private readonly sel: ReturnType<typeof promotionSelectors>;

    constructor(private readonly page: Page) {
        this.sel = promotionSelectors(page);
    }

    async openPromotionTab() {
        await expect(this.sel.promotionTab).toBeVisible();
        await this.sel.promotionTab.click();
        await expect(this.sel.promotionHeading).toBeVisible();
    }

      async createNewTPMPromotion(promotionName: string, startDate: string) {
        await this.openPromotionTab();
        await this.sel.buttonNewTPMPromotion.click();
        await expect(this.sel.textPromotionName).toBeVisible();
        await this.sel.textPromotionName.fill(promotionName);
        await this.sel.promotionStartDate.click();
        await this.sel.promotionStartDate.fill(startDate);
    }

    async savePromotion() {
        await expect(this.sel.buttonSavePromotion).toBeVisible();
        await this.sel.buttonSavePromotion.click();
    }
}