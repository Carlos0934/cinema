import { Hono } from "hono";
import { MovieService } from "./movie.service.ts";

const movieRouter = new Hono();

movieRouter.get("/", async (c) => {
  const movieService = new MovieService();
  const movies = await movieService.getMovies();

  return c.json(movies);
});

movieRouter.get("/:id", async (c) => {
  const movieService = new MovieService();

  const movie = await movieService.getMovie(Number(c.req.param("id")));
  if (movie) {
    return c.json(movie);
  } else {
    return c.status(404);
  }
});

export default movieRouter;
