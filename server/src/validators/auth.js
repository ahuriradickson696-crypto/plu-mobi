import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  pathway: z.enum(["UGANDA", "DIASPORA"]),
  location: z.string().min(1, "Location is required"),
  identityNumber: z.string().optional().default(""),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits"),
  assistedBy: z.string().optional(),
  // Accept both boolean `true` (JSON clients) and string `"true"` (FormData).
  // Reject `"false"`, empty string, undefined — those are still invalid consent.
  consent: z
    .union([z.boolean(), z.string()])
    .refine((v) => v === true || v === "true", {
      message: "You must agree to the Privacy Policy and Terms of Service",
    
  sex: z.enum(["MALE","FEMALE"]),
  dateOfBirth: z.string().min(1),
  subCounty: z.string().min(1),
  village: z.string().min(1),
  occupation: z.string().optional().nullable(),
  maritalStatus: z.string().optional().nullable(),
}).passthrough();

export const loginSchema = z.object({
  identifier: z.string().min(3, "Phone or email required"),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits"),
});

