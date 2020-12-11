const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context, callback) => {
    // let url = JSON.parse(event.body).url;
    let number = null
    let browser = null
    console.log('spawning chrome headless')
    try {
      const executablePath = await chromium.executablePath
  
      // setup
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: executablePath,
        headless: chromium.headless,
      })
  
      // Do stuff with headless chrome
      const page = await browser.newPage()
      const targetUrl = "https://www.booli.se/orebro+lan/318/?isNewConstruction=0"

      // Goto page and then do stuff
      await page.goto(targetUrl, {
        waitUntil: ["domcontentloaded", "networkidle0"]
      })
      await page.waitForSelector('#js__search-summary')

      const text = await page.$eval('#js__search-summary > div > span > h1', el => el.innerText)
      var r = /\d+/;
      number = text.match(r);
      console.log('done on page', number)
  
    } catch (error) {
      console.log('error', error)
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: error
        })
      })
    } finally {
      // close browser
      if (browser !== null) {
        await browser.close()
      }
    }
  
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        number: number,
      })
    })
  }