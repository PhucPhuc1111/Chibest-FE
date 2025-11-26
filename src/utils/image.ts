const ABSOLUTE_URL_REGEX = /^(https?:|data:|blob:|\/\/)/i;
const DEFAULT_IMAGE = "/images/noimage.png";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export const DEFAULT_PRODUCT_IMAGE = DEFAULT_IMAGE;

export const buildProductImageUrl = (rawSrc?: string | null): string => {
  if (!rawSrc) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmed = rawSrc.trim();
  if (!trimmed) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const normalized = trimmed.replace(/\\/g, "/");

  if (ABSOLUTE_URL_REGEX.test(normalized)) {
    return normalized;
  }

  if (API_BASE_URL) {
    return `${API_BASE_URL}/api/file/image?urlPath=${encodeURIComponent(normalized)}`;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

