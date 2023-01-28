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
