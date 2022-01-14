const puppeteer = require('puppeteer')

getListTopGamesCryptoToday = async(req,res) =>{
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()

  var objCrypto = []

  await page.goto('https://crypto.com/price/categories/gamefi')
  for(i = 4; i < 11; i++){

      let nameElemet = await page.waitForSelector("#__next > div.css-19qzm77 > div.chakra-container.css-p5b43h > div > div.css-1y0bycm > table > tbody > tr:nth-child(1) > td.css-1qxvubu > div > a > span.chakra-text.css-1mrk1dy")
      let name = await page.evaluate(nameElemet => nameElemet.textContent, nameElemet)

      objCrypto.push({name})
  }
 
  browser.close() 
  return objCrypto

}
console.log(getListTopGamesCryptoToday());

