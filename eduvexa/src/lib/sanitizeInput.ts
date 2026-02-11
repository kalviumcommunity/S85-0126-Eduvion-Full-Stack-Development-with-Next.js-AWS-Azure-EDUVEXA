/**
 * Sanitize user input to prevent XSS attacks (OWASP best practice).
 * Removes all HTML tags and their contents.
 * @param {string} input - User-controlled input string
 * @returns {string} - Sanitized string safe for storage
 */
export function sanitizeInput(input: string): string {
  // Remove all HTML tags and their contents
  return input.replace(/<[^>]*>/g, "").trim();
}
