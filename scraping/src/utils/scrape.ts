import { Page, ElementHandle } from "puppeteer";
import {
  extractText,
  listingReducer,
  numberFromText,
  parseSpanishDateToIso,
  parseStringDuration,
  parseStringTime,
} from "./functions.ts";

import { Movie, MovieEntry, ListingEntry } from "../types.ts";

export const scrapeMoviePoster = async (page: Page): Promise<MovieEntry> => {
  const container = (await page.$("#main")!) as ElementHandle;

  const title = await extractText(container, "h4");

  const data = await container.$eval("h6", (node: Node) => {
    const validTextNodes = Array.from(node.childNodes).filter(
      (node) =>
        node.textContent?.replaceAll("\n", "").trim() !== "" &&
        node?.textContent
    );

    return {
      gender:
        validTextNodes
          .at(1)
          ?.textContent?.replaceAll("\n", "")
          .trim()
          .split("/")
          .map((text: string) => text.trim()) || [],

      classification: validTextNodes.at(3)?.textContent?.trim() || null,
      duration: validTextNodes.at(5)?.textContent?.trim() || null,

      releaseDate: validTextNodes.at(7)?.textContent?.trim() || null,
      protagonists:
        validTextNodes
          .at(9)
          ?.textContent?.trim()
          .split(",")
          .map((text: string) => text.trim()) || [],
      directors:
        validTextNodes
          .at(11)
          ?.textContent?.trim()
          .split(",")
          .map((text: string) => text.trim()) || [],
      writers:
        validTextNodes
          .at(13)
          ?.textContent?.trim()
          .split(",")
          .map((text: string) => text.trim()) || [],
      synopsis: validTextNodes.at(15)?.textContent?.trim() || null,
    };
  });

  const movie = {
    ...data,
    title,
    releaseDate: data.releaseDate
      ? parseSpanishDateToIso(data.releaseDate) || null
      : null,
    duration: data.duration ? parseStringDuration(data.duration) : null,
  };

  return movie;
};
export const scrapeMovieListings = async (
  page: Page,
  date: Date,
  theater: string
): Promise<ListingEntry[]> => {
  const container = await page.$$("#horarios .row");
  const listings: ListingEntry[] = [];

  for (const listing of container) {
    const durations = await listing.$$(" .three-fourth a");
    const language = await extractText(listing, "h5 i");

    const link = await listing.$eval(".one-fourth a", (node) =>
      node.getAttribute("href")
    );
    const parseTimes = await Promise.all(
      durations?.map(async (duration) => {
        const durationText = await duration.evaluate(
          (node) => node?.textContent || 0
        );

        return durationText ? parseStringTime(durationText) : 0;
      })
    );

    listings.push({
      showTimes: parseTimes.flatMap((time) =>
        time == 0 ? new Date(time + date.getTime()).toISOString() : []
      ),
      language: language.toLowerCase(),
      id: numberFromText(link),
      theater,
    });
  }

  return listings;
};

export const getListings = async (page: Page) => {
  const datesSelector = await page.$$(".dates-bar a[data-date] ");
  const allListings: ListingEntry[] = [];

  const cineInfo = await page.$("#cineinfo");
  if (!cineInfo) return allListings;

  const theaterName = await extractText(cineInfo, "h2");
  /*
  const theaterAddress = await extractText(cineInfo, ".address");
  const theaterPhone = await extractText(cineInfo, ".phone");
  */

  for (const selector of datesSelector) {
    try {
      await selector.click();
      await page.waitForSelector("#horarios script", { timeout: 5000 });

      const dataDate = await selector.evaluate((node) => node.dataset.date);

      const date = new Date(dataDate);

      const listings = await scrapeMovieListings(page, date, theaterName);

      allListings.push(...listings);
    } catch (e) {
      continue;
    }
  }

  return allListings;
};
export const getMovies = async ({
  page,
  baseUrl,
  listings,
}: {
  page: Page;
  baseUrl: string;
  listings: ListingEntry[];
}) => {
  const listingsById = listings.reduce(listingReducer, {});
  const movies: Movie[] = [];
  for (const [key, value] of Object.entries(listingsById)) {
    await page.goto(`${baseUrl}/movie/${key}/?rd`);
    const entry = await scrapeMoviePoster(page);
    movies.push({ ...entry, ...value });
  }
  return movies;
};

export const getTheaterListings = async ({
  BASE_URL,
  page,
}: {
  page: Page;
  BASE_URL: string;
}) => {
  const homePage = `${BASE_URL}/location/republica-dominicana/`;
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
  return allListings;
};
