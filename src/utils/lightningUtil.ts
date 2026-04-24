import { Page, expect } from '@playwright/test';
/**
 * Wait until Salesforce Lightning page is stable:
 * - All SLDS spinners disappear
 * - Optional: waits for a target component/selector to appear
 */
export async function waitForLightningReady(page: Page, targetSelector?: string) {
    // 1. Wait for any active spinners to disappear
    await page.waitForSelector('.slds-spinner', { state: 'detached', timeout: 15000 });

    // 2. Wait until no spinners exist at all (secondary defensive check)
    await page.waitForFunction(() => {
        return !document.querySelector('.slds-spinner');
    });

    // 3. If a specific component needs to be loaded (Account, Product, Promotion pages)
    if (targetSelector) {
        await page.waitForSelector(targetSelector, { timeout: 20000 });
    }
}