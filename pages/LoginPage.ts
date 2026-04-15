import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url: string;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly form: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = 'http://localhost/LedgerAccounting/login.php';

    // Locators
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Log on' });
    this.form = page.locator('form');
    this.logoutLink = page.getByRole('link', { name: 'log out' });
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto(this.url);
  }

  /**
   * Enter username
   * @param {string} username - The username to enter
   */
  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password
   * @param {string} password - The password to enter
   */
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Perform login with username and password
   * @param {string} username - The username
   * @param {string} password - The password
   */
  async login(username: string, password: string) {
    await this.usernameInput.click();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Click the logout link
   */
  async logout() {
    await this.logoutLink.click();
  }

  /**
   * Take a screenshot of the login page
   * @param {string} path - The path to save the screenshot
   */
  async takeScreenshot(path: string) {
    await this.page.screenshot({ path });
  }

  /**
   * Verify all expected elements are present on the login page
   */
  async verifyPageElements() {
    const { expect } = await import('@playwright/test');

    await expect(this.form).toContainText('Existing User Login:');
    await expect(this.page.locator('div')).toContainText('Username or email address:');
    await expect(this.page.locator('div')).toContainText('Password:');
    await expect(this.loginButton).toContainText('Log on');
    await expect(this.page.locator('div')).toContainText('Forgot password');
    await expect(this.form).toContainText('Don\'t have an account?');
    await expect(this.form).toContainText('Sign up for a new account here.');
  }

  async verifyUserNameRequiredError() {
    const usernameRequired = this.page.locator('text=*Username required');
    const { expect } = await import('@playwright/test');
    await expect(usernameRequired).toBeVisible();
  } 

  async verifyPasswordRequiredError() {
    const passwordRequired = this.page.locator('text=*Password needed');
    const { expect } = await import('@playwright/test');
    await expect(passwordRequired).toBeVisible();  
  }

  async verifyLoginFailedError() {
    const unamePwdFailed = this.page.locator('text=Username and password combination not recognized.');
    const { expect } = await import('@playwright/test');
    await expect(unamePwdFailed).toBeVisible();  
  }

  /**
   * Wait for navigation to the dashboard/index page
   */
  async waitForDashboard() {
    await this.page.waitForURL('http://localhost/LedgerAccounting/index.php');
  }

  /**
   * Wait for navigation back to login page
   */
  async waitForLoginPage() {
    await this.page.waitForURL(this.url);
  }
}