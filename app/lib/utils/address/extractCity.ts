/**
 * Extract city from address string
 * 
 * Basic implementation that attempts to extract city from common address formats:
 * - Assumes city is the last comma-separated element if less than 5 parts
 * - Otherwise tries to find the city by looking at typical patterns
 * 
 * @param address Full address string
 * @returns Extracted city or empty string if not found
 */
export function extractCity(address: string): string {
  if (!address) return '';

  // Remove any extra spaces
  const trimmedAddress = address.trim();

  // Split by commas
  const parts = trimmedAddress.split(',').map(part => part.trim());

  // If fewer than 5 parts, assume city is the last part
  if (parts.length < 5 && parts.length > 1) {
    return parts[parts.length - 1];
  }

  // Extract city by typical patterns
  // In European addresses, often the format is:
  // Street name, Building number, Postal code, City, Country
  // Or: Street name Building number, Postal code City, Country

  // Check for postal code + city pattern (e.g., "75001 Paris")
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Look for pattern: "12345 CityName" or similar
    const postalCodeCityMatch = part.match(/^\d+\s+([A-Za-z\s]+)$/);
    if (postalCodeCityMatch) {
      return postalCodeCityMatch[1].trim();
    }
    
    // If this part has no numbers, it might be the city
    if (!/\d/.test(part) && part.length > 1) {
      return part;
    }
  }

  // Fallback to last part if nothing else found
  return parts[parts.length - 1];
}
