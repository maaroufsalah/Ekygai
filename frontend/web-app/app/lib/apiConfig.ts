// For client-side requests (from the browser)
export const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

// For server-side requests (from the Next.js server)
export const serverApiUrl = typeof window === 'undefined'
  ? 'http://api/api/'  // Use Docker network name when running server-side
  : process.env.NEXT_PUBLIC_API_URL;  // Fallback when running in browser context

// Use this function to get the correct API URL based on context
export function getApiUrl() {
  return typeof window === 'undefined' ? serverApiUrl : publicApiUrl;
}