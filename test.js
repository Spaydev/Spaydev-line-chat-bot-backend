
// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");

// URL of the page we want to scrape
const url = "https://nftplazas.com/nft-gaming-news/";

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".post_item");
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { name: "", topic: "" ,date: ""};
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("").text();
      country.date = $(el).children(".post_meta span").text();
      country.topic = $(el).children(".post_meta_item").text();
      country.content = $(el).children(".post_content").text();

      // Populate countries array with country data
      countries.push(country);
    });
    console.log(countries);

  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();

const puppeteer = require('puppeteer')

async function fn() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1600, height: 1600 ,deviceScaleFactor: 2})
  await page.goto('https://nftplazas.com/nft-gaming-news/')
  await page.screenshot({ path: './screenshots/image.jpg', clip: { x: 200, y: 850, width: 800, height: 320 } }) // your original try

  await browser.close()
}
