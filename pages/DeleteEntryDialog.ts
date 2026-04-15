import { Page, Locator } from '@playwright/test';

export class DeleteEntryDialog {
    readonly page: Page;
    readonly container: Locator;

    constructor(page: Page){
        this.page = page;
        this.container = page.locator('#confirmdeletedialog');
    }

    async clickCancelDelete(){
        await this.container.getByRole('button', { name: 'Delete this transaction'}).click();
    }

    async clickCancel() {
        await this.container.getByRole('button', { name: 'Cancel'}).click();
    }

    async findField(value: string){
        await this.container.locator('td').filter({ hasText: value});
    }
}