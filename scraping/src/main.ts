import puppeteer from "puppeteer";

import { insertMovies } from "./utils/insertMovies.ts";
import { getMovies, getTheaterListings } from "./utils/scrape.ts";

const BASE_URL = "https://caribbeancinemas.com";

const browser = await puppeteer.launch({
  headless: true,
});

const page = await browser.newPage();

const listings = await getTheaterListings({ BASE_URL, page });
const movies = await getMovies({
  page,
  baseUrl: BASE_URL,
  listings,
});
await browser.close();

await insertMovies(movies);
