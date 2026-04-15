import { test, expect } from '@playwright/test';

test('Fail login and error messages', async ({ page }) => {
    const url = 'http://localhost/LedgerAccounting/login.php';
    await page.goto(url);

        // Locators
    const usernameInput = page.locator('input[name="username"]');
    const passwordInput = page.locator('input[name="password"]');
    const loginButton = page.getByRole('button', { name: 'Log on' });
    const form = page.locator('form');
    const logoutLink = page.getByRole('link', { name: 'log out' });
    const usernameRequired = page.locator('text=*Username required');
    const passwordRequired = page.locator('text=*Password needed');
    const unamePwdFailed = page.locator('text=Username and password combination not recognized.');

    // Perform login
    // NO username, NO password
    await usernameInput.click();
    await usernameInput.fill('');
    await passwordInput.fill('');
    await loginButton.click();

    await expect(usernameRequired).toBeVisible();
    await expect(passwordRequired).toBeVisible();

    // username, NO password
    await usernameInput.fill('stephanie');
    await loginButton.click();
    await expect(passwordRequired).toBeVisible();
    await expect(usernameRequired).toBeHidden();

    // username, invalid password
    await passwordInput.fill('wrongpassword');
    await loginButton.click();
    await expect(unamePwdFailed).toBeVisible(); 
    await expect(usernameRequired).toBeHidden();
    await expect(passwordRequired).toBeHidden();
    await expect(passwordInput).toBeEmpty();

    // Clear username and try again
    await usernameInput.fill('');
    await passwordInput.fill('hellokitty');
    await loginButton.click();
    await expect(usernameRequired).toBeVisible();
    await expect(passwordRequired).toBeHidden();
    await expect(passwordInput).toBeEmpty();
});