import { test, expect } from '@playwright/test';
import { TransactionDialog } from '../../pages/TransactionDialog';
import { IndexPage } from '../../pages/IndexPage';
import { EntryActionDialog } from '../../pages/EntryActionDialog';
import { DeleteEntryDialog } from '../../pages/DeleteEntryDialog';

test('show entry dialog and cancel', async ({ page }) => {
  const transactionDialog = new TransactionDialog(page);

  await page.goto('http://localhost/LedgerAccounting/login.php');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('stephanie');
  await page.locator('input[name="username"]').press('Tab');
  await page.locator('input[name="password"]').fill('sagegirl1');
  await page.getByRole('button', { name: 'Log on' }).click();
  await page.locator('#newentryheaderbutton').click();

  await transactionDialog.assertVisible();
  await transactionDialog.cancel();
  await transactionDialog.assertNotVisible();

  await page.getByRole('link', { name: 'log out' }).click();
  await expect(page.locator('form')).toContainText('Existing User Login:');
});

// Create a transaction - Expense.
// Verify that the transaction appears in the table with the correct details (date, category, description, amount).
// Verify that the amount is in the correct column (debit for expense, credit for income).
test('test create , delete/cancel/delete transaction', async ({ page }) => {
  const indexPage = new IndexPage(page);

  await page.goto('http://localhost/LedgerAccounting/login.php');
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('stephanie');
  await page.locator('input[name="username"]').press('Tab');
  await page.locator('input[name="password"]').fill('sagegirl1');
  await page.getByRole('button', { name: 'Log on' }).click();
  
  let rnd = Math.random() * 100;
  let amnt = Math.trunc(rnd * 100) / 100; // Round to 2 decimal places
  const amt = amnt.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const dtUsed = new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const transDlg = await indexPage.newEntryClick();

  await transDlg.enterDate(dtUsed);
  await transDlg.selectAccount('Expenses');
  await transDlg.enterCategory('Food stuffs');
  await transDlg.enterDescription('For eaters');
  await transDlg.enterAmount(amnt.toString())
  await transDlg.clickExpense();
  await transDlg.assertNotVisible();



  // Verify that the transaction appears in the table with the correct details
  const tableRow = await indexPage.getTableRow(dtUsed, 'Food stuffs', 'For eaters', amt);
  await expect(tableRow).toBeVisible();
  await expect(tableRow.locator('td').nth(5)).toContainText(amt);
  
  //Get the action button.
  const actionBtn = await indexPage.rowActionButton(tableRow);
  await actionBtn.click();

  const actionDLG = indexPage.entryActionDialog;

  await actionDLG.clickCancel();
  await expect(tableRow).toBeVisible();

  await actionBtn.click();
  await actionDLG.clickDelete();
  const delEntryDialog = indexPage.deleteEntryDialog;

  //Verify all fields of ConfirmDelete dialog.
  let fld1 = delEntryDialog.container.getByRole('cell', { name: dtUsed }); //date
  await expect(fld1).toBeVisible();
  let fld2 = delEntryDialog.container.getByRole('cell', { name: 'Expenses' }); //Category
  await expect(fld2).toBeVisible();
  let fld3 = delEntryDialog.container.getByRole('cell', { name: 'Food stuffs' }); //Category
  await expect(fld3).toBeVisible();
  let fld4 = delEntryDialog.container.getByRole('cell', { name: 'For eaters' }); //Description
  await expect(fld4).toBeVisible();
  // let fld5 = delEntryDialog.container.getByRole('cell', { name: amt }); //amount
  // await expect(fld5).toBeVisible();


  //Cancel delete. Row still present in table.
  await delEntryDialog.clickCancel();
  await expect(tableRow).toBeVisible();

  //Delete transaction. Row not present in table.
  await actionBtn.click();
  await actionDLG.clickDelete();
  await indexPage.deleteEntryDialog.clickCancelDelete();
  await expect(tableRow).not.toBeVisible();

  await page.getByRole('link', { name: 'log out' }).click();
  await expect(page.locator('form')).toContainText('Existing User Login:');
});