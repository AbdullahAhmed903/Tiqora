import { z } from "zod";
import { fullNameSchema, emailSchema, phoneSchema } from "./shared";

export const contactDepartmentSchema = z.enum(
  ["tickets", "payments", "stadium", "organizers", "technical", "general"],
  {
    message: "Please choose the department related to your issue",
  }
);

export const contactFormSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  department: contactDepartmentSchema,
  subject: z.string().trim().max(150, "Subject cannot exceed 150 characters").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please write a message explaining your inquiry (minimum 10 characters)")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
