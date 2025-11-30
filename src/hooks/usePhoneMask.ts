/**
 * Phone number formatting utilities for Russian phone numbers
 * Supports formats: +7XXXXXXXXXX, 8XXXXXXXXXX
 * Output format: +7 (XXX) XXX-XX-XX
 */

export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // If starts with 8, replace with 7
  let normalized = digits;
  if (normalized.startsWith('8')) {
    normalized = '7' + normalized.slice(1);
  }
  
  // Limit to 11 digits (7 + 10 digits of phone number)
  normalized = normalized.slice(0, 11);
  
  // Format according to mask +7 (XXX) XXX-XX-XX
  if (normalized.length === 0) return '';
  if (normalized.length <= 1) return `+${normalized}`;
  if (normalized.length <= 4) return `+${normalized[0]} (${normalized.slice(1)}`;
  if (normalized.length <= 7) return `+${normalized[0]} (${normalized.slice(1, 4)}) ${normalized.slice(4)}`;
  if (normalized.length <= 9) return `+${normalized[0]} (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7)}`;
  return `+${normalized[0]} (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
}

/**
 * Extract clean phone number for backend submission
 * Returns format: +7XXXXXXXXXX
 */
export function extractPhoneDigits(formatted: string): string {
  const digits = formatted.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('7')) {
    return '+' + digits; // +79628265020
  }
  return digits;
}

/**
 * Validate Russian phone number
 * Must be 11 digits starting with 7
 */
export function isValidRussianPhone(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('7');
}
