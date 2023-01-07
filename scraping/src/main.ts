import puppeteer from "puppeteer";
import { getListings, getMovies } from "./scrape.ts";
import { ListingEntry } from "./utils.ts";

const BASE_URL = "https://caribbeancinemas.com";

const homePage = `${BASE_URL}/location/republica-dominicana/`;

const browser = await puppeteer.launch({ headless: false, timeout: 3000 });

const page = await browser.newPage();
await page.goto(homePage);

const links: string[] = await page.$$eval(
  "#menu > ul > li:nth-child(4) > ul  li  a",
  (nodes) => nodes.map((node) => node.getAttribute("href"))
);
const theatersLinks = links.filter((link) => link.includes("theater"));

const allListings: ListingEntry[] = [];
for (const link of theatersLinks) {
  await page.goto(link.replace("//", "https://"));
  console.log(link);
  const listings = await getListings(page);
  allListings.push(...listings);
}

const movies = await getMovies({
  page,
  baseUrl: BASE_URL,
  listings: allListings,
});
await Deno.writeTextFile("data.json", JSON.stringify(movies, null, 2));

/*
const temp_url =
  "https://caribbeancinemas.com/theater/bavaro-at-san-juan-shopping-center/";

const page = await browser.newPage();
await page.goto(temp_url);

const listings = await getListings(page);

console.log(listings);
*/

browser.close();
