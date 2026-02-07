export default function getOrigin(suffix = '', type: 'http' | 'ws' = 'http') {
  if (type === 'ws') {
    if (import.meta.env.VITE_SERVER_PROTOCOL === 'https:') {
      return `wss://${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`;
    }
    if (!import.meta.env.VITE_SERVER_PROTOCOL) {
      if (window.location.protocol === 'https:') {
        return `wss://${window.location.host}${suffix}`;
      }
      return `ws://${window.location.host}${suffix}`;
    }
    return `ws://${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`;
  }

  if (suffix.includes('http')) {
    return suffix;
  }
  if (import.meta.env.VITE_SERVER_HOSTNAME) {
    return `${import.meta.env.VITE_SERVER_PROTOCOL}//${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`;
  }
  return `${window.location.protocol}//${window.location.host}${suffix}`;
}

