import { test as setup, expect } from '@playwright/test'

setup('remove the article', async({request})=>{
    const deleteResponse = await request.delete(`https://conduitapi.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    expect(deleteResponse.status()).toEqual(204)
})
