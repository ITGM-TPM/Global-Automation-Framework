import { Page, Locator } from '@playwright/test';


export class TradePlanningSelectors {

    // ── App Launcher ──────────────────────────────────────────────────────────
    readonly btnAppLauncher: Locator;
    readonly searchBox: Locator;
    readonly optionITGBTPM: Locator;
    readonly tileITGBTPM: Locator;

    // ── Global Search ─────────────────────────────────────────────────────────
    readonly btnGlobalSearch: Locator;
    readonly globalSearchInput: Locator;

    readonly btnUserDetail: Locator;
    readonly btnLoginInFrame: (frame: import('@playwright/test').Frame) => Locator;

    readonly navTradePlanning: Locator;

    // ── Trade Calendar Page ───────────────────────────────────────────────────
    readonly tradeCalendarHeading: Locator;
    readonly lblDefaultView: Locator;
    readonly btnPreviousPeriod: Locator;
    readonly btnNextPeriod: Locator;

    // ── Calendar Grid ─────────────────────────────────────────────────────────
    readonly promotionGroupWrappers: Locator;
    readonly firstPromotionGroupWrapper: Locator;
    readonly firstEmptyPromotionBar: Locator;
    readonly rowLabel: (groupWrapper: Locator) => Locator;

    // ── Promotion Modal ───────────────────────────────────────────────────────
    readonly modalContainer: Locator;
    readonly fldPromotionName: Locator;
    readonly fldStartDate: Locator;
    readonly fldEndDate: Locator;
    readonly btnSave: Locator;
    readonly btnCancel: Locator;

    // ── Toasts / Notifications ────────────────────────────────────────────────
    readonly errorToast: Locator;
    readonly successToast: Locator;

    // ── Setup iframe (Login-As flow) ──────────────────────────────────────────
    static readonly SETUP_FRAME_URL_PATTERNS = [
        'appLayout=setup',
        'isUserEntityOverride=1',
    ];

    constructor(private readonly page: Page) {

        // App Launcher
        this.btnAppLauncher = page.getByRole('button', { name: 'App Launcher' });
        this.searchBox      = page.getByRole('combobox', { name: 'Search apps and items...' });
        this.optionITGBTPM  = page.getByRole('option',  { name: 'ITGB TPM' });
        this.tileITGBTPM    = page.getByTitle('ITGB TPM');

        // Global Search
        this.btnGlobalSearch   = page.locator('button[aria-label="Search"]');
        this.globalSearchInput = page.locator('input[placeholder="Search..."]');

        // User / Login As
        this.btnUserDetail   = page.getByRole('button', { name: 'User Detail' });
        this.btnLoginInFrame = (frame) => frame.locator('input[name="login"]');

        // Navigation
        this.navTradePlanning = page
            .locator('.slds-context-bar')
            .getByRole('link', { name: 'Trade Planning' });

        // Trade Calendar page-level
        this.tradeCalendarHeading = page.locator('text=Trade Calendar');
        this.lblDefaultView       = page.getByRole('button', { name: 'View: Default View' });
        this.btnPreviousPeriod    = page.getByRole('button', { name: 'Previous Period' });
        this.btnNextPeriod        = page.getByRole('button', { name: 'Next Period' });

        // Calendar grid
        this.promotionGroupWrappers    = page.locator('.promotion-group-wrapper');
        this.firstPromotionGroupWrapper = page.locator('.promotion-group-wrapper').first();
        this.firstEmptyPromotionBar    = page
            .locator('.promotion-group-wrapper')
            .first()
            .locator('.promotion-bar.promotion-empty')
            .first();

        // Returns the text label for a given group wrapper (account / product name)
        this.rowLabel = (groupWrapper: Locator) =>
            groupWrapper.locator('.truncate-label').first();

        // Promotion modal
        this.modalContainer  = page.locator('[class*="modal"]').first();
        this.fldPromotionName = page.locator(
              '//label[contains(text(),"Name")]/ancestor::div[contains(@class,"slds-form-element")]//input'
        );      
        this.fldStartDate    = page.locator(
            '.slds-form-element:has(label:has-text("In-Store Date From")) input.slds-input'
        );
        this.fldEndDate  = page.getByLabel('In-Store Date To', { exact: false });
        this.btnSave     = page.getByRole('button', { name: 'Save',   exact: true });
        this.btnCancel   = page.getByRole('button', { name: 'Cancel', exact: true });

        // Toasts
        this.errorToast   = page.locator(
            '[class*="slds-notify_toast"][class*="error"], [class*="toastMessage"][class*="error"]'
        );
        this.successToast = page.locator(
            '[class*="slds-notify_toast"][class*="success"], [class*="toastMessage"][class*="success"]'
        );
    }
}