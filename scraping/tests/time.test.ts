import {
  parseSpanishDateToIso,
  parseStringTime,
  parseStringDuration,
} from "../src/utils.ts";

import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";

Deno.test("Time should parse PM format", () => {
  const result = parseStringTime("12:00 PM");
  assertEquals(result, 12 * 60);
});

Deno.test("Time should parse AM format", () => {
  const result = parseStringTime("12:00 AM");
  assertEquals(result, 0);
});

Deno.test("Time should parse 24 hour format", () => {
  const result = parseStringTime("12:00");
  assertEquals(result, 12 * 60);
});

Deno.test("Date should parse ", () => {
  const result = parseSpanishDateToIso("Diciembre 15, 2022");
  assertEquals(result, "2022-12-15T00:00:00.000Z");
});

Deno.test("Duration should parse ", () => {
  const result = parseStringDuration("1:30");
  assertEquals(result, 90);
});
