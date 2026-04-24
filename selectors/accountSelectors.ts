import { Page, Locator } from '@playwright/test';

export class AccountSelectors {

    // ── App Launcher ──────────────────────────────────────────────────────────
    readonly btnAppLauncher: Locator;
    readonly searchBox: Locator;
    readonly optionITGBSales: Locator;
    readonly optionITGBTPM: Locator;
    readonly tileITGBTPM: Locator;

    // ── Navigation ────────────────────────────────────────────────────────────
    readonly accountsTab: Locator;
    readonly accountHeading: Locator;

    // ── List View Selector ────────────────────────────────────────────────────
    readonly btnSelectListView: Locator;
    readonly optionMyActiveAccounts: Locator;
    readonly optionAllAccounts: Locator;

    // ── List View Toolbar ─────────────────────────────────────────────────────
    readonly btnNew: Locator;
    readonly btnImport: Locator;
    readonly btnRefresh: Locator;
    readonly btnSelectListDisplay: Locator;

    // ── Column Sort ───────────────────────────────────────────────────────────
    readonly btnColumnSort: Locator;
    readonly cboSelectColumn: Locator;
    readonly radioAscending: Locator;
    readonly radioDescending: Locator;
    readonly btnApply: Locator;

    // ── Column Headers ────────────────────────────────────────────────────────
    readonly columnAccountName: Locator;
    readonly columnCRSNumber: Locator;
    readonly columnTerritory: Locator;
    readonly columnBillingCity: Locator;
    readonly columnBillingState: Locator;
    readonly columnParentAccount: Locator;
    readonly columnType: Locator;
    readonly columnTaxEntity: Locator;
    readonly columnOwnerFirstName: Locator;
    readonly columnAccountStatus: Locator;

    // ── Search ────────────────────────────────────────────────────────────────
    readonly accountSearchBox: Locator;

    // ── Dynamic Locators ─────────────────────────────────────────────────────
    
    readonly sortColumnOption: (columnName: string) => Locator;

    
    readonly accountRowLink: (accountName: string) => Locator;

    constructor(private readonly page: Page) {

        // App Launcher
        this.btnAppLauncher  = page.getByRole('button', { name: 'App Launcher' });
        this.searchBox       = page.getByRole('combobox', { name: 'Search apps and items...' });
        this.optionITGBSales = page.getByRole('option', { name: 'ITGB Sales' });
        this.optionITGBTPM   = page.getByRole('option', { name: 'ITGB TPM' });
        this.tileITGBTPM     = page.getByTitle('ITGB TPM');

        // Navigation
        this.accountsTab    = page.getByRole('link',    { name: 'Accounts' });
        this.accountHeading = page.getByRole('heading', { name: 'Accounts', exact: true });

        // List View Selector
        this.btnSelectListView       = page.getByRole('button', { name: 'Select a List View: Accounts' });
        this.optionMyActiveAccounts  = page.getByRole('option', { name: 'My Active Accounts' });
        this.optionAllAccounts       = page.getByRole('option', { name: '13. All Accounts' });

        // List View Toolbar
        this.btnNew               = page.getByRole('button', { name: 'New' });
        this.btnImport            = page.getByRole('button', { name: 'Import' });
        this.btnRefresh           = page.getByRole('button', { name: 'Refresh' });
        this.btnSelectListDisplay = page.getByRole('button', { name: 'Select list display' });

        // Column Sort dialog
        this.btnColumnSort   = page.getByRole('button',   { name: 'Column sort' });
        this.cboSelectColumn = page.getByRole('combobox', { name: 'Select a column' });
        this.radioAscending  = page.locator('.slds-radio_faux').first();
        this.radioDescending = page.locator('span:nth-child(3) > .slds-radio__label > .slds-radio_faux');
        this.btnApply        = page.getByRole('button', { name: 'Apply' });

        // Column headers
        this.columnAccountName    = page.getByRole('button', { name: 'Sort by: Account Name' });
        this.columnCRSNumber      = page.getByRole('button', { name: 'Sort by: CRS Number' });
        this.columnTerritory      = page.getByRole('button', { name: 'Sort by: Territory' });
        this.columnBillingCity    = page.getByRole('button', { name: 'Sort by: Billing City' });
        this.columnBillingState   = page.getByRole('button', { name: 'Sort by: Billing State/' });
        this.columnParentAccount  = page.getByRole('button', { name: 'Sort by: Parent Account' });
        this.columnType           = page.getByRole('button', { name: 'Sort by: Type' });
        this.columnTaxEntity      = page.getByRole('button', { name: 'Sort by: Tax Entity' });
        this.columnOwnerFirstName = page.getByRole('button', { name: 'Sort by: Owner First Name' });
        this.columnAccountStatus  = page.getByRole('button', { name: 'Sort by: Account Status' });

        // Search
        this.accountSearchBox = page.getByRole('searchbox', { name: 'Search this list...' });

        // Dynamic locators
        this.sortColumnOption = (columnName: string) =>
            page.getByRole('option', { name: columnName });

        this.accountRowLink = (accountName: string) =>
            page.getByRole('link', { name: accountName });
    }
}