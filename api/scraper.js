const puppeteer = require("puppeteer");

module.exports = async function (fetchUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: true,

      // Important to run on Heroku and you need to install buildpacks. Look stackoverflow link below
      // https://stackoverflow.com/questions/52225461/puppeteer-unable-to-run-on-heroku
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (req.resourceType() === "image") {
        req.abort();
      } else {
        req.continue();
      }
    });
    //Image blocking code ends

    page.on("error", (err) => {
      console.log("error happen at the page: ", err);
    });

    await page.goto(fetchUrl, {
      timeout: 25000,
      waitUntil: "networkidle2",
    });

    data = await page.evaluate(() => {
      let html = document.getElementsByTagName("body")[0].innerHTML.toString();
      const regex = /[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[0-9a-zA-Z]+/gi;
      //const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const hits = [];
      let match = null;
      do {
        match = regex.exec(html);
        if(match) {
          hits.push(match[0]);
        }
      } while (match);
      return hits;
    });

    await browser.close();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    await browser.close();
  }
};
