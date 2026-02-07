import getOrigin from './origin';

const baseURL = getOrigin(import.meta.env.VITE_API_URL || '');

export function normalizeAssetUrl(url?: string | null): string {
  if (!url) {
    return '';
  }
  if (/^http|^blob/i.test(url)) {
    return url;
  }
  const reg = new RegExp(`^/*${baseURL}/*`);
  return `${baseURL}/${url.replace(reg, '')}`;
}

