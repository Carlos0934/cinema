import { ElementHandle } from "puppeteer";
export const extractText = (
  container: ElementHandle,
  selector: string
): Promise<string> =>
  container
    .$(selector)
    .then(
      (node) =>
        node?.evaluate((node: Node) =>
          node?.textContent
            ? node?.textContent?.trim().replaceAll("\t", "")
            : ""
        ) || ""
    );

export const numberFromText = (text: string) => {
  const number = text.match(/\d+/g);
  return number ? parseInt(number[0]) : 0;
};

export function parseStringTime(time: string): number {
  const timeRegex = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])?)/;
  const match = time.match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format");
  }

  const [, , hour, minute, ampm] = match;

  const hourNumber = parseInt(hour);
  const minuteNumber = parseInt(minute);

  if (ampm === "PM" && hourNumber !== 12)
    return hourNumber * 60 + minuteNumber + 12 * 60;

  if (ampm === "AM" && hourNumber === 12) return minuteNumber;

  return hourNumber * 60 + minuteNumber;
}
export function parseStringDuration(duration: string): number {
  const [hours, minutes] = duration.split(":").map((value) => parseInt(value));
  return hours * 60 + minutes;
}

export function parseSpanishDateToIso(text: string) {
  const months: { [key: string]: number } = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
  };

  const dateRegex = /([a-zA-Z]+) ([0-9]+), ([0-9]+)/;

  const match = text.match(dateRegex);
  if (!match) {
    return null;
  }
  const [, month, day, year] = match;

  const date = new Date(
    Number(year),
    months[month.toLocaleLowerCase()],
    Number(day)
  );

  date.setUTCHours(0, 0, 0, 0);

  return date.toISOString();
}

export type ListingEntry = {
  language: string;
  showTimes: string[];
  theater: string;
  id: number;
};
export type Listing = {
  languages: string[];
  showTimes: string[];
  theaters: string[];
  id: number;
};
export type MovieEntry = {
  title: string;
  releaseDate: string | null;
  duration: number | null;
  gender: string[];
  classification: string | null;
  protagonists: string[];
  directors: string[];
  writers: string[];
  synopsis: string | null;
};

export type Movie = MovieEntry & Listing;

export const listingReducer = (
  acc: Record<string, Listing>,
  curr: ListingEntry
) => {
  acc[curr.id] = {
    id: curr.id,
    showTimes: [...(curr?.showTimes || [])],
    languages: [
      ...new Set([...(acc[curr.id]?.languages || []), curr.language]).values(),
    ],
    theaters: [
      ...new Set([...(acc[curr.id]?.theaters || []), curr.theater]).values(),
    ],
  };
  return acc;
};
