// Rename the test object to `setup` so it's clear this is a setup script
import {test as setup} from '@playwright/test'
// Path where the logged-in session will be saved
const authFile = '.auth/user.json'

//after writing this look to add changes in config ts
setup('auth api', async({page})=>{
    

    await page.goto('https://conduit.bondaracademy.com/')
    // Wait briefly to allow the page and mocked API data to load/render
    await page.waitForTimeout(500)
  
    await page.getByText('Sign in').click()
    await page.getByRole('textbox',{name:'Email'}).fill('wild99@test.com')
    await page.getByRole('textbox',{name:'Password'}).fill('wild99')
    await page.getByRole('button', {name:' Sign in '}).click()
    await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags")
    await page.waitForTimeout(1000)

    // Save the logged-in session (cookies, localStorage, etc.)
    await page.context().storageState({path: authFile})

})