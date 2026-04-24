import { Page } from '@playwright/test';

export const productSelectors = (page: Page) => ({
    btnAppLauncher: page.getByRole('button', { name: 'App Launcher' }),
    searchAppBox: page.getByRole('combobox', { name: 'Search apps and items...' }),
    optionITGBTPM: page.getByRole('option', { name: 'ITGB TPM' }),
    tileITGBTPM: page.getByTitle('ITGB TPM'),

    productsTab: page.locator('.slds-context-bar').getByRole('link', { name: 'Products' }),
    productsHeading: page.getByRole('heading', { name: 'Products', exact: true }),

    btnSelectListView: page.getByRole('button', { name: 'Select a List View: Products' }),
    optionAllProducts: page.getByRole('option', { name: 'All Products' }),

    columnProductName: page.getByRole('button', { name: 'Sort by: Product Name' }),
    columnUPCCode: page.getByRole('button', { name: 'Sort by: UPC Code' }),
    columnProductFamily: page.getByRole('button', { name: 'Sort by: Product Family' }),
    columnDescription: page.getByRole('button', { name: 'Sort by: Description' }),

    btnNew: page.getByRole('button', { name: 'New' }),
    productSearchBox: page.getByRole('searchbox', { name: 'Search this list...' }),
    btnListViewControls: page.getByRole('button', { name: 'List View Controls' }),
    btnRefresh: page.getByRole('button', { name: 'Refresh' }),
    btnSelectListDisplay: page.getByRole('button', { name: 'Select List Display' }),
    btnColumnSort: page.getByRole('button', { name: 'Column sort' }),

    cboSelectColumn: page.getByRole('combobox', { name: 'Select a column' }),
    radioAscending: page.locator('.slds-radio_faux').first(),
    radioDescending: page.locator('span:nth-child(3) > .slds-radio__label > .slds-radio_faux'),
    btnApply: page.getByRole('button', { name: 'Apply' }),

    columnOption: (columnName: string) => page.getByRole('option', { name: columnName }),
    searchedProduct: (productName: string) => page.getByRole('link', { name: productName, exact: true }),
});