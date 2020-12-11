const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context, callback) => {
    let body = JSON.parse(event.body);
    console.log('body', body)
    let browser = null
    console.log('spawning chrome headless')
    var text = "";
    try {

      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      })
  
      // Do stuff with headless chrome
      const page = await browser.newPage()
      // Goto page and then do stuff
      await page.goto(body.url, {waitUntil: ["domcontentloaded"]})
      text = await page.$eval(body.selector, el => el.innerText)
      // var r = /\d+/;
      // number = text.match(r)[0];
    } catch (err) {
      console.log('error', err)
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: err
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
        text: text,
      })
    })
  }