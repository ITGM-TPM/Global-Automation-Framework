import { chromium, expect, FullConfig } from "@playwright/test";
import fs from "node:fs";
import crypto from "node:crypto";
import 'dotenv/config';

/**
 * Global setup:
 * 1) Build a fresh short-lived JWT (exp = now + 3m)
 * 2) Exchange for access token at SF_TOKEN_HOST
 * 3) Call Single-Access UI Bridge on instance_url (relative redirect)
 * 4) Open frontdoor once and save storageState.json
 *
 * Works with My Domain (SF_AUD/SF_TOKEN_HOST = My Domain) or login host (test/login).
 */

/* ------------------------------- helpers ------------------------------- */

function b64url(input: string | Buffer) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/=+$/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

function makeFreshJwt(): string {
    const iss = process.env.SF_CLIENT_ID!;
    const sub = process.env.SF_USERNAME!;
    const aud = process.env.SF_AUD || "https://test.salesforce.com"; // default: Sandbox login host
    const exp = Math.floor(Date.now() / 1000) + 60 * 3; // <= 5 minutes (short-lived)

    if (!iss) throw new Error("Missing SF_CLIENT_ID");
    if (!sub) throw new Error("Missing SF_USERNAME");
    if (!aud) throw new Error("Missing SF_AUD (JWT audience)");

    const header = { alg: "RS256", typ: "JWT" };
    const claims = { iss, sub, aud, exp };

    const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;

    const keyPath = process.env.SF_JWT_PRIVATE_KEY_PATH || "./secrets/jwtRS256.key";
    if (!fs.existsSync(keyPath)) throw new Error(`Private key not found: ${keyPath}`);
    const privateKeyPem = fs.readFileSync(keyPath, "utf8");

    const signature = crypto.createSign("RSA-SHA256").update(signingInput).sign(privateKeyPem);
    return `${signingInput}.${b64url(signature)}`;
}

async function exchangeJwtForToken(assertion: string) {
    const tokenHost = process.env.SF_TOKEN_HOST || "https://test.salesforce.com";
    const res = await fetch(`${tokenHost}/services/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion
        })
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(`JWT exchange failed: ${res.status} ${res.statusText} ${JSON.stringify(json)}`);
    }
    // { access_token, instance_url, token_type, issued_at, ... }
    return json as { access_token: string; instance_url: string; token_type: string };
}

// Decode minimal HTML entities that UI Bridge response might include (e.g., &amp;)
function htmlEntityDecode(s: string) {
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

/**
 * Single-Access UI Bridge:
 * - Call on instance_url host
 * - redirect_uri must be RELATIVE
 * Returns a clean frontdoor URL string suitable for page.goto()
 */
async function uiBridgeFrontdoor(instanceUrl: string, accessToken: string, redirectUri: string) {
    const res = await fetch(`${instanceUrl}/services/oauth2/singleaccess`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/plain, */*"
        },
        body: new URLSearchParams({ redirect_uri: redirectUri }) // must be RELATIVE
    });

    const raw = await res.text();
    if (!res.ok) throw new Error(`UI Bridge error: ${res.status} ${raw}`);

    // Response can be plain text or JSON with {"frontdoor_uri":"..."}
    let url = raw.trim();
    if (url.startsWith('{')) {
        try {
            const obj = JSON.parse(url);
            if (typeof obj.frontdoor_uri === 'string') url = obj.frontdoor_uri;
        } catch { /* treat as plain text */ }
    }

    // Convert &amp; -> &
    return htmlEntityDecode(url);
}

/* ----------------------------- global setup ---------------------------- */

export default async function globalSetup(_config: FullConfig) {
    // 1) Mint a fresh short-lived assertion
    const jwt = makeFreshJwt();

    // 2) Exchange for an access token at the chosen host (must match SF_AUD)
    const { access_token, instance_url } = await exchangeJwtForToken(jwt);

    // 3) Bridge token → UI session (frontdoor URL)
    const redirect = process.env.SF_RET_URL || "/lightning/page/home"; // must be RELATIVE
    const frontdoor = await uiBridgeFrontdoor(instance_url, access_token, redirect);

    // 4) Open once, verify, and save storageState.json
    const browser = await chromium.launch();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto(frontdoor, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.waitForURL(/\/lightning\//, { timeout: 45_000 });
    await expect(page.locator("body")).toContainText(/Lightning|Home|App Launcher/i);

    const storagePath = process.env.SF_STORAGE_STATE || "storageState.json";
    await ctx.storageState({ path: storagePath });
    await browser.close();
}
