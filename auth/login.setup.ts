import { chromium } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Go to login page (IdP/SSO will redirect automatically)
    await page.goto(process.env.BASE_URL!);

    // Pause so you can manually complete SSO + MFA
    await page.pause();

    // Save state
    await page.context().storageState({ path: "auth/state.json" });
    await browser.close();

    console.log("state.json has been generated.");
})();