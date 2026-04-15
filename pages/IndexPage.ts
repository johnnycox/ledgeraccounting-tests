import { Page, Locator, expect } from '@playwright/test';
import { TransactionDialog } from './TransactionDialog';
import { EntryActionDialog } from './EntryActionDialog';
import { DeleteEntryDialog } from './DeleteEntryDialog';


export class IndexPage {
    readonly page: Page;
    readonly actionBtnIndex: number = 7;

    constructor(page: Page){
        this.page = page;
        //No navigation. Page should be shown on successful login.
    }

    async newEntryClick() {
        await this.page.locator('#newentryheaderbutton').click();
        return new TransactionDialog(this.page);
    }

    async getTableRow(transactiondate: string, category: string, description: string, amnt: string){
        return this.page.locator('table').locator('tr')
        .filter({ has: this.page.locator('td').filter({ hasText: transactiondate }) })
        .filter({ has: this.page.locator('td').filter({ hasText: category }) })
        .filter({ has: this.page.locator('td').filter({ hasText: description }) })
        .filter({ has: this.page.locator('td').filter({ hasText: amnt}) }).first();
    }

    async rowActionButton(row: Locator) {
        return row.locator('td').nth(this.actionBtnIndex).getByRole('button');
    }

    get deleteEntryDialog() {
        return new DeleteEntryDialog(this.page);
    }
    
    get entryActionDialog() {
        return new EntryActionDialog(this.page);
    }
}