import { serve } from "server";
import { Hono } from "hono";
import movieRouter from "./movie/movie.routes.ts";

const app = new Hono();

app.route("/api/movies", movieRouter);

serve(app.fetch);
