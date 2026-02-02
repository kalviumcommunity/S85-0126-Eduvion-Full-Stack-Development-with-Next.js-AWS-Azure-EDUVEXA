// OWASP: Input sanitization utility using sanitize-html
// This function should be used to sanitize all user-controlled input before saving to the database.
import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize user input to prevent XSS attacks (OWASP best practice).
 * @param {string} input - User-controlled input string
 * @returns {string} - Sanitized string safe for storage
 */
export function sanitizeInput(input: string): string {
  // Only allow very basic tags, or none at all for most fields
  return sanitizeHtml(input, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {},
  });
}
