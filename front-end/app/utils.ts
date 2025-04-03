// Helper function to get environment variables with fallbacks
export const getEnvColor = (key: string, fallback: string): string => {
  const envKey = `VITE_COLOR_${key.toUpperCase()}`;
  return import.meta.env[envKey] || fallback;
};

export function ellipseAddress(address = ``, width = 6): string {
  return address
    ? `${address.slice(0, width)}...${address.slice(-width)}`
    : address;
}
