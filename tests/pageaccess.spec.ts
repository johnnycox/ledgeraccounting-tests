import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';


test ('verify redirect on direct access', async ({ page }) => {
  // Make sure logged out.
  await page.goto('http://localhost/LedgerAccounting/clearsession.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');

  await page.goto('http://localhost/LedgerAccounting/Accounts.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');
  
  
  await page.goto('http://localhost/LedgerAccounting/admin.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');
  
  await page.goto('http://localhost/LedgerAccounting/incomereport.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');

  await page.goto('http://localhost/LedgerAccounting/index.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');

  await page.goto('http://localhost/LedgerAccounting/process.php');
  await expect(page).toHaveURL('http://localhost/LedgerAccounting/login.php');
  

});

test('test access restrictions', async ({ page }) => {
  const urlsToTest = [
    { url: 'http://localhost/LedgerAccounting/views/AccountLedgerViews.php', name: 'AccountLedgerViews.php' },
    { url: 'http://localhost/LedgerAccounting/dialogs/confirmdelete.php', name: 'confirmdelete.php' },
    { url: 'http://localhost/LedgerAccounting/src/database.php', name: 'database.php' },
    { url: 'http://localhost/LedgerAccounting/config/validatesession.php', name: 'validatesession.php' },
  ];

  const screenshotDir = 'test-results/screenshots/accesstest';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const results = [];

  for (const { url, name } of urlsToTest) {
    let passed = true;
    let error: string | null = null;
    let statusCode: number | null = null;

    try {
      const response = await page.goto(url);
      if (response) {
        statusCode = response.status();
      }

      // Take screenshot
      const screenshotPath = path.join(screenshotDir, `${name.replace('.php', '')}.png`);
      await page.screenshot({ path: screenshotPath });

      // Verify access is forbidden (HTTP 403)
      expect(statusCode).toBe(403);
    } catch (e: unknown) {
      passed = false;
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = String(e);
      }
    }

    results.push({
      url,
      name,
      statusCode,
      passed,
      error,
    });

    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}: ${url} - Status: ${statusCode}${error ? ` - ${error}` : ''}`);
  }

  // Print summary
  console.log('\n=== Access Restriction Test Summary ===');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  // Assert that all tests passed
  expect(failed).toBe(0);
});



test('test user has no access to admin page', async ({ page }) => {
  
    const url = 'http://localhost/LedgerAccounting/login.php';
    await page.goto(url);
    
    const loginPage = new LoginPage(page);

  // Navigate to login page and verify elements
  await loginPage.goto();

  // Perform login
  await loginPage.login('stephanie', 'sagegirl1');
  await loginPage.waitForDashboard();

  await page.goto('http://localhost/LedgerAccounting/admin.php');
  await expect(page.locator('text=Access Forbidden.')).toBeVisible() ;

  // Logout
  await page.goto('http://localhost/LedgerAccounting/clearsession.php');
});

test('test user databases cannot be accesses', async ({ page }) => {
  await page.goto('http://localhost/LedgerAccounting/steph070268/ledger.db');
  await expect(page.locator('text=Forbidden')).toBeVisible();

  
  await page.goto('http://localhost/LedgerAccounting/jon8234987/ledger.db');
  await expect(page.locator('text=Forbidden')).toBeVisible() ;
  
  await page.goto('http://localhost/LedgerAccounting/admindb/ledger.db');
  await expect(page.locator('text=Forbidden')).toBeVisible() ;


});