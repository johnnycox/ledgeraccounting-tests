import { Page, Locator, expect } from '@playwright/test';

export class EntryActionDialog {
    readonly page: Page;
    readonly container: Locator; 

    constructor(page: Page){
        this.page = page;
        this.container = page.locator('#trans_action');
    }

    async clickEdit(){
        await this.container.getByRole('button', { name: 'Edit'}).click();
    }

    async clickDelete() {
        await this.container.getByRole('button', { name: 'Delete'}).click();
    }

    async clickCancel() {
        await this.container.getByRole('button', { name: 'Cancel'}).click();
    }
}