import { request, expect } from '@playwright/test'
import fs from 'fs'
import user from '../playwright_api_course/.auth/user.json'

async function globalSetup() {
    const authFile = '.auth/user.json'

    const context = await request.newContext()
    const responseToken = await context.post('https://conduitapi.bondaracademy.com/api/users/login', {
        data: {
          user: {
            email: 'wild99@test.com',
            password: 'wild99'
          }
        }
      })
    
      // Parse the response JSON to extract the access token
    const responseBody = await responseToken.json()
    const accessToken = responseBody.user.token
    
      // Inject the token into the storage JSON structure (typically used in localStorage for auth)
    user.origins[0].localStorage[0].value = accessToken
    
      // Save the modified session to a file for reuse in other tests
    fs.writeFileSync(authFile, JSON.stringify(user))
    
    process.env['ACCESS_TOKEN'] = accessToken
    const articleRsponse = await context.post('https://conduitapi.bondaracademy.com/api/articles/', {
            data:{
              "article":{"title":"Global Likes test article","description":"my","body":"manipulation","tagList":[]}
            },
            headers:{
                Authorization: `Token ${process.env.ACCESS_TOKEN}`
            }
        
          })
        
          //checking response code
          
    expect(articleRsponse.status()).toEqual(201)
    
    const response = await articleRsponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId
}

export default globalSetup