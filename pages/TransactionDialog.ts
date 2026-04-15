import { Page, Locator, expect } from '@playwright/test';

export class TransactionDialog {

    readonly page: Page;
    readonly container: Locator;
    readonly dateInput: Locator;
    readonly accountID: Locator;
    readonly categoryInput: Locator;
    readonly descriptionInput: Locator;
    readonly amountInput: Locator;
    readonly revenueButton: Locator;
    readonly expenseButton: Locator;  
    readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('#ledgerentrydialog');
    // Locators
    this.dateInput = this.container.locator('#transactiondate');
    this.accountID = this.container.locator('#accountId');
    this.categoryInput = this.container.locator('#category');
    this.descriptionInput = this.container.locator('#description');
    this.amountInput = this.container.locator('#amount');
    this.revenueButton = this.container.getByRole('button', { name: '+ REVENUE' });
    this.expenseButton = this.container.getByRole('button', { name: '- EXPENSE' });
    this.cancelButton = this.container.locator('button').filter({ hasText: '×' });
  };

  async selectAccount(accountName: string) {
    await this.accountID.selectOption(accountName);
  }

  async clickExpense() {
    await this.expenseButton.click();
  }
  
  async enterAmount(amount: string) {
    await this.amountInput.click();
    await this.amountInput.fill(amount);
    await this.amountInput.press('Tab');
  }

  async enterCategory(categoryName: string) {
    await this.categoryInput.click();
    await this.categoryInput.fill(categoryName);
    await this.categoryInput.press('Tab');
  }

  async enterDate(date: string) {
    await this.dateInput.click();
    await this.dateInput.fill(date);
    await this.dateInput.press('Tab');
  }
  
  async enterDescription(description: string) {
    await this.descriptionInput.click();
    await this.descriptionInput.fill(description);
    await this.descriptionInput.press('Tab');
  } 

  async useDefaultDate() {
    await this.dateInput.click();
    await this.dateInput.press('Tab');
  }

  async getDate() {
    return await this.dateInput.inputValue();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async assertVisible() {
    await expect(this.container).toBeVisible();
  }

  async assertNotVisible() {
    await expect(this.container).not.toBeVisible();
  }
};