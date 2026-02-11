/**
 * Utility function to calculate the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns Sum of a and b
 */
export const sum = (a: number, b: number): number => {
  return a + b;
};

/**
 * Utility function to validate email format
 * @param email - Email string to validate
 * @returns True if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Utility function to capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
