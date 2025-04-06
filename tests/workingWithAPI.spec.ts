import { test, expect } from '@playwright/test';
// Import mocked tags data from a JSON file - and gave it name of tags
import tags from '../tests/test-data/test-data.json'

test.beforeEach(async ({page})=>{
  // Set up an API mock for the /api/tags endpoint (request)
  // This must be done before the page sends a request to this endpoint
  //route should be given befor page is opened to know which API to connect to
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route=>{
    // Fulfill the request with the mocked tags data
    await route.fulfill({
        contentType: 'application/json', // Set correct content type for JSON
        body: JSON.stringify(tags) // Convert the imported JSON to a string
    })
  })
  
  //modifying response
  //nortice that i used witdcards to excahage for full api link
  await page.route('*/**/api/articles*', async route=>{
    //creating variable that stores all the respons
    const response = await route.fetch()
    //creating variable that stores body of response in json format
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a test title"
    responseBody.articles[0].description = "This is me mocking the description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
  // Wait briefly to allow the page and mocked API data to load/render
  await page.waitForTimeout(2000)
})

test('has title', async ({ page }) => {

  await expect(page.locator('.navbar-brand')).toHaveText('conduit');

  expect (page.locator('app-article-list h1').first()).toContainText("This is a test title")
  expect (page.locator('app-article-list p').first()).toContainText("This is me mocking the description")
});

