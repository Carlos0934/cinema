import { z, ZodSchema } from "zod";

export const movieSchema = z.object({
  title: z.string(),
  releaseDate: z.coerce.date().nullable(),
  duration: z.number().nullable(),
  gender: z.array(z.string()),
  classification: z.string().nullable(),
  protagonists: z.array(z.string()),
  directors: z.array(z.string()),
  writers: z.array(z.string()),
  synopsis: z.string().nullable(),
});

export type MovieSchema = z.infer<typeof movieSchema>;
