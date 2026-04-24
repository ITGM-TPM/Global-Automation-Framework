import { Page } from '@playwright/test';

export const promotionSelectors = (page: Page) => ({
    btnAppLauncher: page.getByRole('button', { name: 'App Launcher' }),
    searchAppBox: page.getByRole('combobox', { name: 'Search apps and items...' }),
    optionITGBTPM: page.getByRole('option', { name: 'ITGB TPM' }),
    tileITGBTPM: page.getByTitle('ITGB TPM'),

    promotionTab: page.getByRole('link', { name: 'Advanced Promotions' }),
    promotionHeading: page.getByRole('heading', { name: 'Advanced Promotions', exact: true }),

    btnSelectListView: page.getByRole('button', { name: 'Select a List View: Advanced' }),
    searchListInput: page.getByRole('combobox', { name: 'Search lists...' }),
    optionAll: page.getByRole('option', { name: 'All' }),

    columnPromotionName: page.getByRole('button', { name: 'Sort by: Promotion Name' }),
    columnName: page.getByRole('button', { name: 'Sort by: Name' }),
    columnPromotionTemplate: page.getByRole('button', { name: 'Sort by: Promotion Template' }),
    columnPromotionStartDate: page.getByRole('button', { name: 'Sort by: Promotion Start Date' }),
    columnPromotionEndDate: page.getByRole('button', { name: 'Sort by: Promotion End Date' }),
    columnStatus: page.getByRole('button', { name: 'Sort by: Status' }),
    columnAnchorCustomer: page.getByRole('button', { name: 'Sort by: Anchor Customer' }),
    columnSalesOrg: page.getByRole('button', { name: 'Sort by: Sales Org' }),

    searchPromotionBox: page.getByRole('searchbox', { name: 'Search this list...' }),

    searchUserButton: page.getByRole('button', { name: 'Search' }),
    searchUserInput: page.getByRole('searchbox', { name: 'Search...' }),
    optionTestSalesPlanner: page.locator('span[title="Test Sales Planner"]'),
    buttonUserDetail: page.getByRole('button', { name: 'User Detail' }),
    buttonLogIn: page.frameLocator('iframe[name^="vfFrameId_"]').getByRole('row', { name: 'User Detail Edit Sharing' }).locator('input[name="login"]'),
    textUserLogIn: page.getByText('Logged in as Test Sales'),

    buttonNewTPMPromotion: page.getByRole('button', { name: 'New TPM Promotion' }),
    textPromotionName: page.getByRole('textbox').first(),
    promotionStartDate: page.getByRole('textbox', { name: '*In-Store Date From (M/D/YYYY)' }),
    buttonSavePromotion: page.getByRole('button', { name: 'Save', exact: true }),

    searchedPromotion: (promotionName: string) => page.getByRole('link', { name: promotionName }),
});