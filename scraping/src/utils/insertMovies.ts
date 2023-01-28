import { MovieSchema, movieSchema } from "../schema.ts";
import { Movie } from "../types.ts";
import { connect } from "./connect.ts";

export const insertMovies = async (movies: Movie[]) => {
  const client = await connect();

  const db = client.database("cinema");

  const moviesCollection = db.collection<MovieSchema>("movies");
  const validMovies = movies
    .filter((movie) => movieSchema.safeParse(movie).success)
    .map((movie) => movieSchema.parse(movie));
  const result = await moviesCollection.insertMany(validMovies);

  console.log(`${result.insertedCount} movies inserted.`);

  client.close();
};
