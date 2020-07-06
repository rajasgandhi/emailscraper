/*const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const axios = require('axios');

puppeteer.use(StealthPlugin());

module.exports = async function (fetchUrl) {
  try {
    const browser = await puppeteer.launch({
      headless: true,

      // Important to run on Heroku and you need to install buildpacks. Look stackoverflow link below
      // https://stackoverflow.com/questions/52225461/puppeteer-unable-to-run-on-heroku
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    //Image blocking code starts

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

    const selectorData = await page.evaluate((selector) => {
      let html =  document.getElementsByTagName("body")[0].innerText;
      //if (html.test(selector)) { // or whatever attribute you want to search
      ///output.push(html.test(selector));
      //}
      var dd = html.match(selector);
      console.log(html.match(selector));
      console.log(html);
      console.log(selector);
      return html.match(selector);
    }, selector);
    //console.log(fetchUrl);

    data1 = await page.

    data = await page.evaluate(function output() {
      let html = document.getElementsByTagName("body")[0].innerText;
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result1 = html.toString().toLowerCase().trim();//.replace(/\s/g, '');
      //var dd = "rajasmgandhi@gmail.com";
      const result2 = result1.match(regex);
      if(result2 == null) {
        return "No emails found on " + this.fetchUrl;
      }
      return result1;
    });

    await browser.close();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    await browser.close();
  }
};*/
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
