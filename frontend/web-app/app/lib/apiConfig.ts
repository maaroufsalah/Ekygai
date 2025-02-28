// For client-side requests (from the browser)
export const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

// For server-side requests (from the Next.js server)
export const serverApiUrl = process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

// Use this function to get the correct API URL based on context
export function getApiUrl() {
  return typeof window === 'undefined' ? serverApiUrl : publicApiUrl;
}