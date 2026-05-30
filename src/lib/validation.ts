/**
 * Form field validation functions for CareerSpark.
 *
 * Each function returns null when the value is valid, or a non-null error
 * string describing the problem when the value is invalid.
 *
 * Requirements: 3.3, 3.4, 3.5, 3.6, 4.3, 4.4, 4.5, 4.6
 */

/**
 * Validates that a name is not blank or whitespace-only.
 *
 * Returns null for any string that contains at least one non-whitespace
 * character. Returns an error string for empty strings and strings composed
 * entirely of whitespace characters.
 *
 * Requirements: 3.3, 4.3
 */
export function validateName(value: string): string | null {
  if (value.trim().length === 0) {
    return 'Full name is required.';
  }
  return null;
}

/**
 * Validates that a phone number consists of exactly 10 ASCII digit characters.
 *
 * Accepts strings matching /^\d{10}$/ — no spaces, dashes, or other
 * characters are permitted. Returns null for valid input, an error string
 * otherwise.
 *
 * Requirements: 3.4, 4.4
 */
export function validatePhone(value: string): string | null {
  if (!/^\d{10}$/.test(value)) {
    return 'Phone number must be exactly 10 digits.';
  }
  return null;
}

/**
 * Validates that an email address conforms to the standard local@domain.tld
 * format.
 *
 * The pattern requires:
 *   - One or more characters that are not '@' (local part)
 *   - A literal '@'
 *   - One or more characters that are not '@' (domain label)
 *   - A literal '.'
 *   - One or more characters that are not '@' (TLD)
 *
 * Returns null for valid input, an error string otherwise.
 *
 * Requirements: 3.5, 4.5
 */
export function validateEmail(value: string): string | null {
  // Regex: local part, @, domain, dot, TLD — all parts must be non-empty
  // and none may contain another '@'.
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

/**
 * Validates that a percentage is a numeric value in the closed interval
 * [0, 100].
 *
 * Accepts strings that parse to a finite number between 0 and 100 inclusive.
 * Rejects empty strings, non-numeric strings, and values outside [0, 100].
 *
 * Requirements: 3.6, 4.6
 */
export function validatePercentage(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed === '') {
    return 'Percentage is required.';
  }

  const num = Number(trimmed);

  if (!isFinite(num) || isNaN(num)) {
    return 'Percentage must be a number.';
  }

  if (num < 0 || num > 100) {
    return 'Percentage must be between 0 and 100.';
  }

  return null;
}
