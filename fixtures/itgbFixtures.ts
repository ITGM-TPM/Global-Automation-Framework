import { test as base }from '@playwright/test';
import { waitUntilAppIdle }from '../utils/commonLogic';
import { selectors } from '../selectors/commonSelector'; 
import { ITGBAccountsPage }from '../pages/ITGBAccountsPage';
import { TradePlanningPage }from '../pages/TradePlanningPage';
import { ITGBAdvancedPromotionPage }from '../pages/ITGBAdvancedPromotionPage';
import { ITGBProductsPage } from '../pages/ITGBProductsPage';

// ── Fixture Types ──────────────────────────────────────────────────────────────
type ITGBFixtures = {
    launchApp:     void;                     
    accountsPage:  ITGBAccountsPage;
    tradePage:     TradePlanningPage;
    promotionPage: ITGBAdvancedPromotionPage;
    productPage:   ITGBProductsPage;
};

// ── Extended test with ITGB fixtures ──────────────────────────────────────────
export const test = base.extend<ITGBFixtures>({

   
    launchApp: async ({ page }, use) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // App Launcher open 
       await page.locator('[title="App Launcher"]').click();
//        await page.locator(stringFormat(subAreaMenuSelectors.DynamicAppLauncherButton, 'App Launcher')).click();


        // ITGB TPM search and  click 
        const searchBox = page.locator('input[placeholder="Search apps and items..."]');
        await searchBox.fill('ITGB TPM');
        await page.locator('one-app-launcher-menu-item').filter({ hasText: 'ITGB TPM' }).click();

        console.log('[Fixture] ITGB TPM App launched successfully.');
        await use();
    },


    accountsPage: async ({ page, launchApp }, use) => {
        await use(new ITGBAccountsPage(page));
    },

    tradePage: async ({ page, launchApp }, use) => {
        await use(new TradePlanningPage(page));
    },

    promotionPage: async ({ page, launchApp }, use) => {
        await use(new ITGBAdvancedPromotionPage(page));
    },

    productPage: async ({ page, launchApp }, use) => {
        await use(new ITGBProductsPage(page));
    },
});

export { expect } from '@playwright/test';