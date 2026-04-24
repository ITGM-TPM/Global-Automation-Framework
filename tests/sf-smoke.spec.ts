
import { test, expect } from '@playwright/test';
import { ProductsNav } from "../pages/ProductsPage";

test('Salesforce UI is authenticated', async ({ page }) => {
    await page.goto('/lightning/page/home');
    await expect(page.locator('body')).toContainText(/Lightning|Home|App Launcher/i);
    await page.pause();
});

/*
test('App Launcher opens', async ({ page }) => {
    await page.goto('/lightning/page/home');
    await page.getByRole('button', { name: /App Launcher/i }).click();
    await expect(page.getByRole('dialog')).toContainText(/App Launcher/i);
});


test("Go to Products page", async ({ page }) => {
    await page.goto("/");
    //const nav = new ProductsNav(page);
    //await nav.gotoProducts(page);
    await page.pause();
});
*/