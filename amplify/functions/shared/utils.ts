/**
 * Utility functions for Lambda functions
 * Contains common helper functions that can be shared across multiple Lambda functions
 */

/**
 * Convert all number values in an object to strings recursively
 * This is useful for storing data in DynamoDB which requires consistent data types
 * @param obj - The object to convert
 * @returns Object with all numbers converted to strings
 */
export function stringifyNumbers(obj: any): any {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(stringifyNumbers);
    }
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = stringifyNumbers(value);
    }
    return result;
  }
  if (typeof obj === 'number') {
    return String(obj);
  }
  return obj;
}

/**
 * Convert numeric string fields back to numbers recursively
 * This is useful for converting DynamoDB data back to proper number types
 * @param obj - The object to convert
 * @returns Object with numeric strings converted back to numbers
 */
export function parseNumbers(obj: any): any {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(parseNumbers);
    }
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Convert numeric string fields back to numbers for survey answers
      // Skip text fields like 'openEnded'
      if (key !== 'openEnded' && typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
        result[key] = Number(value);
      } else {
        result[key] = parseNumbers(value);
      }
    }
    return result;
  }
  return obj;
}

/**
 * Validate if a value is a valid number within a specified range
 * @param value - The value to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if the value is a valid number within range
 */
export function isValidNumberInRange(value: any, min: number, max: number): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}


