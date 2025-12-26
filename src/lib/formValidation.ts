import { z } from 'zod';

// Name validation: Unicode letters, spaces, hyphens, apostrophes
const NAME_REGEX = /^[\p{L}\s\-']+$/u;

// Lead form schema for Calculator
export const calculatorLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя слишком короткое")
    .max(100, "Имя слишком длинное")
    .regex(NAME_REGEX, "Имя содержит недопустимые символы"),
  phone: z
    .string()
    .regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  email: z
    .string()
    .email("Некорректный email")
    .max(255, "Email слишком длинный")
    .optional()
    .or(z.literal('')),
});

// Lead form schema for PopupForm
export const popupLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя слишком короткое")
    .max(100, "Имя слишком длинное")
    .regex(NAME_REGEX, "Имя содержит недопустимые символы"),
  phone: z
    .string()
    .regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
});

// Types
export type CalculatorLeadData = z.infer<typeof calculatorLeadSchema>;
export type PopupLeadData = z.infer<typeof popupLeadSchema>;

// Validation helper
export function validateLeadData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.issues.map(issue => issue.message);
  return { success: false, errors };
}

// Sanitize name on client side (remove HTML tags and dangerous chars)
export function sanitizeName(name: string): string {
  return name
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"&;{}|\\^~\[\]`]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 100);
}
