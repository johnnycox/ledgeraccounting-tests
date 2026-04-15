import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Login and logout flow', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page and verify elements
  await loginPage.goto();
  // await loginPage.takeScreenshot('test-results/screenshots/loginpage.png');
  await loginPage.verifyPageElements();

  // Perform login
  await loginPage.login('stephanie', 'sagegirl1');
  await loginPage.waitForDashboard();

  // Logout
  await loginPage.logout();
  await loginPage.waitForLoginPage();

  // Verify login page is displayed again
  await loginPage.verifyPageElements();
});
