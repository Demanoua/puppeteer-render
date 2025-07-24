const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      "--disable-dev-shm-usage"
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    headless: "new",
    timeout: 60000
  });
  
  try {
        console.log('Browser launched');
        
        const page = await browser.newPage();
        await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
        
        const title = await page.title();
        console.log('Page title:', title); 
        
        const h1Content = await page.$eval('h1', (el) => el.textContent);
        console.log('H1 content:', h1Content); 
        
        const pContent = await page.$eval('p', (el) => el.textContent);
        console.log('First paragraph:', pContent.trim()); 
        
        const logStatement = `The title of this blog post is ${h1Content}`;
        console.log(logStatement);
        res.send(logStatement);

        return {
            title,
            h1: h1Content,
            firstParagraph: pContent.trim()
        };


  } catch (e) {
    console.error('Error in scrapeLogic:', e);
    res.status(500).send(`Something went wrong while running Puppeteer: ${e.message}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };