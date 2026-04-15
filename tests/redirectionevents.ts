import { test, expect } from '@playwright/test';

test('test logged out access restrictions', async ({ page }) => {
    // If not logged in, should be redirected to login page for all these URLs
    const loginUrl = 'http://localhost/LedgerAccounting/login.php';

    const urlsToTest = [
        { url: 'http://localhost/LedgerAccounting/index.php', name: 'index.php' },
        { url: 'http://localhost/LedgerAccounting/Accounts.php', name: 'Accounts.php' },
        { url: 'http://localhost/LedgerAccounting/incomereport.php', name: 'incomereport.php' },
    ];

    for (const { url, name} of urlsToTest) {
        // Navigate to the URL
        await page.goto(url);
        // Verify we are redirected to the login page
        await expect(page).toHaveURL(loginUrl);
        console.log(`[PASS] ${name}: Redirected to login page as expected.`);
    }
});
