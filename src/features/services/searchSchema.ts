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
};

export const validateServicesSearch = zodValidator(servicesSearchSchema);
