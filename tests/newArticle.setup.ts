import { test as setup, expect } from '@playwright/test'

setup('create new article', async({request})=>{
    
    const articleRsponse = await request.post('https://conduitapi.bondaracademy.com/api/articles/', {
        data:{
          "article":{"title":"Likes test article","description":"my","body":"manipulation","tagList":[]}
        }
    
      })
    
      //checking response code
      
      expect(articleRsponse.status()).toEqual(201)

      const response = await articleRsponse.json()
      const slugId = response.article.slug
      process.env['SLUGID'] = slugId


})