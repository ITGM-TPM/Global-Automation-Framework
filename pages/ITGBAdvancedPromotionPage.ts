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

    async searchPromotion(promotionName: string): Promise<boolean> {
        await expect(this.sel.searchPromotionBox).toBeVisible();
        await this.sel.searchPromotionBox.fill(promotionName);
        await this.sel.searchPromotionBox.press('Enter');
        return this.sel.searchedPromotion(promotionName).isVisible().catch(() => false);
    }

    async loginTestSalesPlanner() {
        await expect(this.sel.searchUserButton).toBeVisible();
        await this.sel.searchUserButton.click();
        await this.sel.searchUserInput.waitFor({ state: 'visible' });
        await this.sel.searchUserInput.fill('Test Sales Planner');
        await this.sel.searchUserInput.press('Enter');
        await this.sel.buttonUserDetail.click();
        await this.sel.buttonLogIn.click();
        await expect(this.sel.textUserLogIn).toBeVisible();
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