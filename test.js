
// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");

// URL of the page we want to scrape


// Async function which scrapes the data
async function scrapeData() {
  const url = "https://nftplazas.com/nft-gaming-news/";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const ArrayGame = [];

    const Categories = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_categories");
    const Title = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_title");
    const Link = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_categories");
    const Image = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_featured");
    const Content = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_body ");
    const DateTime = $(".wpb_column .wpb_wrapper .sc_recent_news .post_item .post_meta");

    let obj = {};

    Categories.each((idx, el) => { 
      obj.categorie = $(el).children("").text();
    });

    Title.each((idx, el) => {
      obj.title = $(el).children("").text();
    });

    Link.each((idx, el) => {
      obj.link = $(el).children("").attr('href');
    });

    Image.each((idx, el) => {
      obj.image = $(el).children("").attr('src');
    });

    Content.each((idx, el) => {
      obj.content = $(el).children(".post_content").text().replace(/\r?\n?\t|\r/g, "");
    });

    DateTime.each((idx, el) => {
      obj.date = $(el).children(".post_date").text();
    });
    
  } catch (err) {
    console.error(err);
  }
  return obj
}
// Invoke the above function
