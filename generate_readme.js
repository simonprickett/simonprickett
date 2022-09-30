const fetch = require('node-fetch');
const fs = require('fs');
const jsdom = require('jsdom');
const handlebars = require('handlebars');

const WEBSITE_HOME_PAGE = 'https://simonprickett.dev';

async function updateReadme() {
  // Grab my website's home page and parse it.
  const homePage = await fetch(WEBSITE_HOME_PAGE);
  const homePageHtml = await homePage.text();
  const homePageDom = new jsdom.JSDOM(homePageHtml);
  const homePageDoc = homePageDom.window.document;

  // Now grab some data items about the latest article from the page source we just fetched.
  const titleLink = homePageDoc.querySelector('body > main > div > div.row.remove-site-content-margin > div:nth-child(1) > div > div > h2 > a');
  const title = titleLink.innerHTML;
  const url = `${WEBSITE_HOME_PAGE}${titleLink.attributes.getNamedItem('href').value}`;
  const excerpt = homePageDoc.querySelector('body > main > div > div.row.remove-site-content-margin > div:nth-child(1) > div > div > p').innerHTML;
  const imageDivAttrs = homePageDoc.querySelector('body > main > div > div.row.remove-site-content-margin > div:nth-child(1) > div > a > div').attributes;
  const imageStyleAttr = imageDivAttrs.getNamedItem('style').value;
  const imageUrl = `${WEBSITE_HOME_PAGE}${imageStyleAttr.substring(imageStyleAttr.indexOf('(') + 1, imageStyleAttr.indexOf(')')).trim()}`;
  
  console.log(title);
  console.log(url);
  console.log(excerpt);
  console.log(imageUrl);

  // Build a new README.md from the template.md file and values gathered from my website.
  const template = handlebars.compile(fs.readFileSync('template.md').toString());
  const newReadMe = template({ title, excerpt, url, imageUrl });

  fs.writeFileSync('README.md', newReadMe);
}

updateReadme();
