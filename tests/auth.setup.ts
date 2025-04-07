// Import the Playwright test object, renaming it to `setup`
// This clarifies the intent: it's for pre-test setup, not an actual test case
import { test as setup } from '@playwright/test'

// Import a previously saved user session structure (used to inject into storage)
import user from '../.auth/user.json'
// lib to work with files
import fs from 'fs'

// Define the path where we'll save the new logged-in storage state
const authFile = '.auth/user.json'

// -- API-based login setup --
setup('store auth via api', async ({ request }) => {

  // Send a login request directly to the backend API with known user credentials
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      user: {
        email: 'wild99@test.com',
        password: 'wild99'
      }
    }
  })

  // Parse the response JSON to extract the access token
  const responseBody = await response.json()
  const accessToken = responseBody.user.token

  // Inject the token into the storage JSON structure (typically used in localStorage for auth)
  user.origins[0].localStorage[0].value = accessToken

  // Save the modified session to a file for reuse in other tests
  fs.writeFileSync(authFile, JSON.stringify(user))

  process.env['ACCESS_TOKEN'] = accessToken
})




// -- UI-based setup block (commented out) --
// This would have automated the login via the UI (clicks, fills, etc.),
// and then saved the authenticated storage state to a file for reuse.
// It's commented out because you're now doing it via the API (which is better for speed and stability).

/*
setup('store auth via ui', async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/')
  await page.waitForTimeout(500)

  await page.getByText('Sign in').click()
  await page.getByRole('textbox', { name: 'Email' }).fill('wild99@test.com')
  await page.getByRole('textbox', { name: 'Password' }).fill('wild99')
  await page.getByRole('button', { name: ' Sign in ' }).click()

  await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags")
  await page.waitForTimeout(1000)

  await page.context().storageState({ path: authFile })
})
*/