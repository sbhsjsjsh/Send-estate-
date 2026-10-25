export interface PropertyData {
  name: string;
  price: string;
  image: string; // Primary image
  images?: string[]; // Additional images
  description?: string;
  location?: string;
}

export function encodeProperty(data: PropertyData): string {
  try {
    const json = JSON.stringify(data);
    // Use btoa for Base64 encoding
    // In browser btoa is available, in Node it's Buffer
    const base64 = btoa(unescape(encodeURIComponent(json)));
    // Make it URL safe
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Encoding failed', e);
    return '';
  }
}

export function decodeProperty(encoded: string): PropertyData | null {
  try {
    // Add padding back if needed
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch (e) {
    console.error('Decoding failed', e);
    return null;
  }
}
