import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date");

export const optionalIsoDate = z.union([z.literal(""), isoDate]);

export const trimmedRequired = z.string().trim().min(1, "Required");
export const trimmedOptional = z.string().trim();
