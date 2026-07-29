import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

export const servicesSearchSchema = z.object({
  sector: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  governorate: fallback(z.string(), "").default(""),
  city: fallback(z.string(), "").default(""),
  area: fallback(z.string(), "").default(""),
  rating: fallback(z.number(), 0).default(0),
  verified: fallback(z.boolean(), false).default(false),
  available: fallback(z.boolean(), false).default(false),
  maxPrice: fallback(z.number(), 0).default(0),
  sort: fallback(z.string(), "relevance").default("relevance"),
  q: fallback(z.string(), "").default(""),
  // URL-driven pagination — the page number is shareable and survives reloads.
  page: fallback(z.number(), 1).default(1),
  pageSize: fallback(z.number(), 9).default(9),
});

export type ServicesSearch = z.infer<typeof servicesSearchSchema>;

export const defaultSearch: ServicesSearch = {
  sector: "",
  category: "",
  governorate: "",
  city: "",
  area: "",
  rating: 0,
  verified: false,
  available: false,
  maxPrice: 0,
  sort: "relevance",
  q: "",
  page: 1,
  pageSize: 9,
};

export const validateServicesSearch = zodValidator(servicesSearchSchema);
