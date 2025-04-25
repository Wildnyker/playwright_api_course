import {test, expect, request} from '@playwright/test'


test('likes counter', async({page})=>{
    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Global Feed').click()
    const firstLikeButton = await page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeButton).toHaveText('0')
    await firstLikeButton.click()
    await expect(firstLikeButton).toHaveText('1')
})