import type { PrintSize } from "@/lib/photography";

// ── Paper types ───────────────────────────────────────────────────────────────

export type PaperType = "Glossy" | "Matte" | "Fine Art Cotton";

export const PAPER_TYPES: PaperType[] = ["Glossy", "Matte", "Fine Art Cotton"];

export const PAPER_TYPE_DESCRIPTIONS: Record<PaperType, string> = {
  "Glossy":           "Vibrant colours, sharp details. Classic photo print.",
  "Matte":            "Soft finish, no glare. Ideal for framing.",
  "Fine Art Cotton":  "Museum-quality cotton rag, archival grade.",
};

// ── Print size dimensions (mm) ────────────────────────────────────────────────
// [shortEdgeMm, longEdgeMm] — orientation-agnostic

export const PRINT_SIZE_DIMS_MM: Record<PrintSize, [number, number]> = {
  "A4":        [210, 297],
  "A3":        [297, 420],
  "A2":        [420, 594],
  "A1":        [594, 841],
  "A0":        [841, 1189],
  "30×30 cm":  [300, 300],
  "40×40 cm":  [400, 400],
  "50×50 cm":  [500, 500],
  "20×25 cm":  [200, 250],
  "20×30 cm":  [200, 300],
  "30×40 cm":  [300, 400],
  "30×45 cm":  [300, 450],
  "40×60 cm":  [400, 600],
  "50×75 cm":  [500, 750],
};

// ── Price matrix (Euro cents) ─────────────────────────────────────────────────

export const PRICE_MATRIX_CENTS: Record<PrintSize, Record<PaperType, number>> = {
  "A4":        { "Glossy": 2500,  "Matte": 2800,  "Fine Art Cotton": 4500  },
  "A3":        { "Glossy": 3500,  "Matte": 4000,  "Fine Art Cotton": 6500  },
  "A2":        { "Glossy": 5500,  "Matte": 6500,  "Fine Art Cotton": 9500  },
  "A1":        { "Glossy": 8500,  "Matte": 10000, "Fine Art Cotton": 14500 },
  "A0":        { "Glossy": 13000, "Matte": 15500, "Fine Art Cotton": 22000 },
  "30×30 cm":  { "Glossy": 3000,  "Matte": 3500,  "Fine Art Cotton": 5000  },
  "40×40 cm":  { "Glossy": 4500,  "Matte": 5200,  "Fine Art Cotton": 7500  },
  "50×50 cm":  { "Glossy": 6500,  "Matte": 7500,  "Fine Art Cotton": 11000 },
  "20×25 cm":  { "Glossy": 2200,  "Matte": 2500,  "Fine Art Cotton": 4000  },
  "20×30 cm":  { "Glossy": 2500,  "Matte": 2800,  "Fine Art Cotton": 4500  },
  "30×40 cm":  { "Glossy": 3800,  "Matte": 4400,  "Fine Art Cotton": 6800  },
  "30×45 cm":  { "Glossy": 4200,  "Matte": 4800,  "Fine Art Cotton": 7200  },
  "40×60 cm":  { "Glossy": 5800,  "Matte": 6800,  "Fine Art Cotton": 10000 },
  "50×75 cm":  { "Glossy": 8000,  "Matte": 9500,  "Fine Art Cotton": 13500 },
};

export const POSTCARD_PRICE_CENTS = 500; // €5.00

// Shipping costs in cents
export const SHIPPING_COSTS_CENTS: Record<string, number> = {
  NL:  450,   // Netherlands
  EU:  750,   // Rest of EU
  WW:  1200,  // Worldwide
};

// EU country codes (ISO 3166-1 alpha-2), for shipping zone detection
export const EU_COUNTRY_CODES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU",
  "IE","IT","LV","LT","LU","MT","PL","PT","RO","SK","SI","ES","SE",
]);

export const MIN_PRINT_DPI = 200;
export const ASPECT_RATIO_TOLERANCE = 0.07; // ±7% relative

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getPriceCents(size: PrintSize, paper: PaperType): number {
  return PRICE_MATRIX_CENTS[size][paper];
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function shippingZone(countryCode: string): "NL" | "EU" | "WW" {
  if (countryCode === "NL") return "NL";
  if (EU_COUNTRY_CODES.has(countryCode)) return "EU";
  return "WW";
}

export function shippingCents(countryCode: string): number {
  return SHIPPING_COSTS_CENTS[shippingZone(countryCode)];
}

/**
 * Compute which print sizes are available for a photo.
 * Requires widthPx/heightPx from EXIF (stored in photos.json).
 */
export function getAvailablePrintSizes(widthPx: number, heightPx: number): PrintSize[] {
  const longPx  = Math.max(widthPx, heightPx);
  const shortPx = Math.min(widthPx, heightPx);
  const photoAR = longPx / shortPx;

  return (Object.keys(PRINT_SIZE_DIMS_MM) as PrintSize[]).filter((size) => {
    const [a, b] = PRINT_SIZE_DIMS_MM[size];
    const longMm  = Math.max(a, b);
    const shortMm = Math.min(a, b);
    const sizeAR  = longMm / shortMm;

    // Resolution check: photo long edge must cover print long edge at MIN_PRINT_DPI
    const requiredPx = (longMm / 25.4) * MIN_PRINT_DPI;
    if (longPx < requiredPx) return false;

    // Aspect ratio check (normalised long/short both sides)
    return Math.abs(photoAR - sizeAR) / sizeAR <= ASPECT_RATIO_TOLERANCE;
  });
}

// ── Cart item types ───────────────────────────────────────────────────────────

export type TextStyle = "handwritten" | "printed";

export interface PrintCartItem {
  type: "print";
  id: string;
  photoFilename: string;
  photoTitle: string;
  photoImageUrl: string;
  size: PrintSize;
  paper: PaperType;
  priceCents: number;
}

export interface PostcardCartItem {
  type: "postcard";
  id: string;
  photoFilename: string;
  photoTitle: string;
  photoImageUrl: string;
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  messageText: string;
  textStyle: TextStyle;
  senderName: string;
  priceCents: number;
}

export type CartItem = PrintCartItem | PostcardCartItem;
