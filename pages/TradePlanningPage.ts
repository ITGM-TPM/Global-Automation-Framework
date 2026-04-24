import { Page, Locator, expect, Frame } from '@playwright/test';
import { TradePlanningSelectors }       from '../selectors/tradePlanningSelectors';

export interface CalendarSlot {
    accountName: string;
    rowArea: Locator;
    emptyX: number;
    emptyY: number;
}

export interface PromotionDates {
    startDate: string;
    
}


export class TradePlanningPage {

    private readonly sel: TradePlanningSelectors;

    constructor(private readonly page: Page) {
        this.sel = new TradePlanningSelectors(page);
    }

    /**
     * Login-as flow: search for a user in Global Search, open their User Detail
     * page, then click Login to impersonate them, and finally navigate to the
     * Trade Planning section.
     *
     * @param username - The user to search for (e.g. 'Test Sales Planner')
     */
    async loginAsUserAndNavigateToTradePlanning(username: string): Promise<void> {
        await this._globalSearchFor(username);
        await this._loginAsUserFromDetailPage();
        await this._clickTradePlanningNav();
    }

    /**
     * Navigate to the Trade Calendar (assumes the user is already logged in as
     * the correct profile and the ITGB TPM app is open).
     */
    async navigateToTradeCalendar(): Promise<void> {
        await this._globalSearchFor('Test Sales Planner');
        await this._loginAsUserFromDetailPage();
        await this._clickTradePlanningNav();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    //  CALENDAR INTERACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Scan the calendar grid and return co-ordinates of the first empty
     * promotion slot in the first account row.
     *
     * Returns `null` if no slot is found (grid not rendered or all rows full).
     */
    async findFirstAvailableCalendarSlot(): Promise<CalendarSlot | null> {
        // Wait until the calendar chrome is present
        await expect(this.sel.btnPreviousPeriod).toBeVisible({ timeout: 20_000 });

        // Wait for at least one promotion row to render
        await expect(this.sel.firstPromotionGroupWrapper).toBeVisible({ timeout: 15_000 });

        const emptyBar = this.sel.firstEmptyPromotionBar;
        await expect(emptyBar).toBeVisible({ timeout: 10_000 });

        const box = await emptyBar.boundingBox();
        if (!box) {
            console.warn('[TradePlanningPage] Could not obtain bounding box for first empty bar.');
            return null;
        }

        const accountName = (
            await this.sel.rowLabel(this.sel.firstPromotionGroupWrapper).textContent()
        ) ?? 'Row 1';

        const emptyX = box.x + box.width  * 0.5;
        const emptyY = box.y + box.height * 0.5;

        console.log(
            `[TradePlanningPage] Available slot — account: "${accountName.trim()}", ` +
            `x=${emptyX.toFixed(0)}, y=${emptyY.toFixed(0)}`
        );

        return { accountName: accountName.trim(), rowArea: emptyBar, emptyX, emptyY };
    }

    /**
     * Call {@link findFirstAvailableCalendarSlot} first to obtain `startX / startY`.
     *
     * @param startX    
     * @param startY    
     * @param endX     
     * @param endY      
     * @param steps     
     */
    async selectDateRangeByDrag(
        startX: number,
        startY: number,
        endX:   number,
        endY:   number,
        steps = 10,
    ): Promise<void> {
        console.log(
            `[TradePlanningPage] Dragging (${startX.toFixed(0)}, ${startY.toFixed(0)}) → ` +
            `(${endX.toFixed(0)}, ${endY.toFixed(0)})`
        );
        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY, { steps });
        await this.page.mouse.up();
        console.log('[TradePlanningPage] Drag completed.');
    }

   
    /**
     * Wait for the promotion-creation modal to become visible.
     */
    async waitForPromotionModal(): Promise<void> {
        await this.page.waitForSelector('[class*="modal"]', { state: 'visible', timeout: 10_000 });
        console.log('[TradePlanningPage] Promotion modal is visible.');
    }

    /**
     * Fill in the promotion name field inside the modal
     * with a unique value.
     */
    async fillPromotionName(name: string): Promise<string> {
        const randomNum = Math.floor(1000 + Math.random() * 9000); 
        const finalName = `Automation Test ${name} ${randomNum}`;

        await expect(this.sel.fldPromotionName).toBeVisible();
        await this.sel.fldPromotionName.fill(finalName);

        console.log(`Promotion Name used: ${finalName}`);

        return finalName; 
    }

    /**
     * Read the auto-populated start and end dates from the modal.
     */
    async getPromotionDates(): Promise<PromotionDates> {
        const startDate = await this.sel.fldStartDate.inputValue();
        return { startDate };
    }

    /**
     * High-level helper: fill the promotion name, then save and wait for the
     * modal to close.
     */
    async createTradePlan(promotionName: string): Promise<PromotionDates> {
        await this.waitForPromotionModal();
        await this.fillPromotionName(promotionName);

        const dates = await this.getPromotionDates();
        console.log(
            `[TradePlanningPage] Creating promotion "${promotionName}" — ` +
            `start: ${dates.startDate}`
        );

        await this.savePromotion();
        return dates;
    }

    /**
     * Click the Save button and wait for it to disappear (modal closed / view mode).
     */
    async savePromotion(): Promise<void> {
        await expect(this.sel.btnSave).toBeVisible();
        await this.sel.btnSave.click();
        console.log('[TradePlanningPage] Save clicked.');
    }

    /**
     * Click the Cancel button on the modal.
     */
    async cancelPromotion(): Promise<void> {
        await expect(this.sel.btnCancel).toBeVisible();
        await this.sel.btnCancel.click();
        console.log('[TradePlanningPage] Modal cancelled.');
    }

    

    /**
     * Assert the Trade Calendar heading is visible on the page.
     */
    async validateTradeCalendarHeadingVisible(): Promise<void> {
    await this.page.pause();
        await expect(this.sel.tradeCalendarHeading).toBeVisible();
    }

    /**
     * Assert the Default View label/button is visible.
     */
    async validateDefaultViewLabelVisible(): Promise<void> {
        await expect(this.sel.lblDefaultView).toBeVisible();
    }

    /**
     * Assert the promotion creation modal is currently visible.
     */
    async validatePromotionModalVisible(): Promise<void> {
        await expect(this.sel.modalContainer).toBeVisible();
    }

    /**
     * Assert the Save button is NOT visible (page is in view mode after save).
     */
    async validateFormExitedEditMode(): Promise<void> {
        await expect(this.sel.btnSave).not.toBeVisible();
    }

    /**
     * Assert both Save and Cancel buttons are visible (form is in edit mode).
     */
    async validateFormInEditMode(): Promise<void> {
        await expect(this.sel.btnSave).toBeVisible();
        await expect(this.sel.btnCancel).toBeVisible();
    }

    /**
     * Assert a specific date value is shown in the Start Date field.
     */
    async validateStartDate(expectedDate: string): Promise<void> {
        const value = await this.sel.fldStartDate.inputValue();
        expect(value).toBe(expectedDate);
    }

   
    /**
     * Assert that the auto-populated start date is not empty.
     */
    async validateStartDateAutoPopulated(): Promise<void> {
        const value = await this.sel.fldStartDate.inputValue();
        expect(value.trim()).not.toBe('');
    }

    
    
    /**
     * Assert every field in `fieldLabels` has a non-empty value.
     *
     * @param fieldLabels - Visible label text for each field
     */
    async validateRequiredFieldsFilled(fieldLabels: string[]): Promise<void> {
    for (const label of fieldLabels) {

        const field = this.page.locator(
            `//*[contains(text(),"Name")]/ancestor::div[contains(@class,"slds-form-element")]//input`
        );

        await field.waitFor({ state: 'visible' });

        const value = await field.inputValue();

        expect(value.trim(), `Required field "${label}" should not be empty`)
            .not.toBe('');

        console.log(`[TradePlanningPage] Field "${label}" has value: "${value}"`);
    }
}

    /**
     * Assert no error toast is displayed on the page.
     */
    async validateNoErrorToast(): Promise<void> {
        await expect(this.sel.errorToast).not.toBeVisible();
    }

    /**
     * Assert a success toast is visible (e.g. after saving a record).
     */
    async validateSuccessToastVisible(timeout = 10_000): Promise<void> {
        await expect(this.sel.successToast).toBeVisible({ timeout });
    }

    
    async validateTradeEntry(savedDates: PromotionDates): Promise<void> {
        if (savedDates.startDate) {
            console.log(`[TradePlanningPage] Confirmed saved start date: ${savedDates.startDate}`);
        }
       
    }

    // ═══════════════════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private async _globalSearchFor(searchTerm: string): Promise<void> {
        await expect(this.sel.btnGlobalSearch).toBeVisible();
        await this.sel.btnGlobalSearch.click();

        await expect(this.sel.globalSearchInput).toBeVisible({ timeout: 5_000 });
        await this.sel.globalSearchInput.fill(searchTerm);
        await this.sel.globalSearchInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        console.log(`[TradePlanningPage] Global search for "${searchTerm}".`);
    }

    private async _loginAsUserFromDetailPage(): Promise<void> {
        await expect(this.sel.btnUserDetail).toBeVisible({ timeout: 10_000 });
        await this.sel.btnUserDetail.click();
        console.log('[TradePlanningPage] Clicked "User Detail".');

        await this.page.pause();

        // // Wait for the Salesforce Setup classic iframe to attach, then click Login
        // const setupFrame = await this.page.waitForEvent('frameattached', {
        //     predicate: (frame: Frame) =>
        //         TradePlanningSelectors.SETUP_FRAME_URL_PATTERNS.some(p =>
        //             frame.url().includes(p)
        //         ),
        //     timeout: 30_000,
        // });
        // console.log('[TradePlanningPage] Setup iframe attached:', setupFrame.url());

        // await setupFrame.waitForSelector('div.pbHeader', { state: 'visible', timeout: 30_000 });

        // const loginBtn = this.sel.btnLoginInFrame(setupFrame);
        // await expect(loginBtn).toBeVisible({ timeout: 10_000 });
        // await loginBtn.click();
        // await this.page.waitForLoadState('networkidle');
        // console.log('[TradePlanningPage] Logged in as selected user.');
    }

    private async _clickTradePlanningNav(): Promise<void> {
        await expect(this.sel.navTradePlanning).toBeVisible({ timeout: 15_000 });
        await this.sel.navTradePlanning.click();
        await this.page.waitForLoadState('domcontentloaded');
        console.log('[TradePlanningPage] Navigated to Trade Planning.');
    }
}