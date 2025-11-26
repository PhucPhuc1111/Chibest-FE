const PRODUCT_IMAGE_PROXY_ENDPOINT =
  process.env.NEXT_PUBLIC_PRODUCT_IMAGE_ENDPOINT ||
  "https://localhost:44334/api/file/image?urlPath=";
const PRODUCT_VIDEO_PROXY_ENDPOINT =
  process.env.NEXT_PUBLIC_PRODUCT_VIDEO_ENDPOINT ||
  "https://localhost:44334/api/file/video?urlPath=";

export const DEFAULT_PRODUCT_IMAGE = "/images/noimage.png";

const isAbsoluteSource = (src: string) =>
  src.startsWith("http://") ||
  src.startsWith("https://") ||
  src.startsWith("data:") ||
  src.startsWith("blob:") ||
  src.startsWith("//");

const normalizePath = (rawPath: string) => rawPath.replace(/\\/g, "/").replace(/^\/+/, "");

const buildProxyUrl = (rawPath: string) => {
  const sanitized = normalizePath(rawPath);
  return `${PRODUCT_IMAGE_PROXY_ENDPOINT}${sanitized}`;
};

export const resolveProductImageSrc = (src?: string | null): string => {
  if (!src) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  if (isAbsoluteSource(trimmed)) {
    return trimmed;
  }

  return buildProxyUrl(trimmed);
};

export const buildProductVideoUrl = (path?: string | null): string => {
  if (!path) {
    return "";
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return "";
  }

  if (isAbsoluteSource(trimmed)) {
    return trimmed;
  }

  const sanitized = normalizePath(trimmed);
  return `${PRODUCT_VIDEO_PROXY_ENDPOINT}${sanitized}`;
};

