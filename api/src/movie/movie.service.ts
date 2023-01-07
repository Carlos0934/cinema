export interface Movie {
  id: number;
  title: string;
  releaseDate: string | null;
  genders: string[];
  classification: string | null;
  duration: number | null;
  synopsis: string | null;
  directors: string[];
  writers: string[];
  protagonists: string[];
}

export class MovieService {
  private path = "./data/movies.json";
  constructor() {}

  getMovies(): Promise<Movie[]> {
    return this.getMoviesFromJson();
  }

  getMovie(id: number): Promise<Movie | undefined> {
    return this.getMoviesFromJson().then((movies) =>
      movies.find((movie) => movie.id === id)
    );
  }

  private getMoviesFromJson(): Promise<Movie[]> {
    return Deno.readTextFile(this.path).then((data) => JSON.parse(data));
  }
}
