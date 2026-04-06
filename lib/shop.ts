import type { PrintSize } from "@/lib/photography";

// ── Markup & labour ───────────────────────────────────────────────────────────
// Change MARKUP to reprice all prints automatically. Labour is per order.

export const MARKUP = 3.5;
export const LABOUR_PER_ORDER_CENTS = 1500; // €15.00 — not added to item price

// ── Paper types ───────────────────────────────────────────────────────────────

export type PaperType = "matte" | "cotton" | "baryta";

export const PAPER_TYPES: PaperType[] = ["matte", "cotton", "baryta"];

export const PAPER_TYPE_LABELS: Record<PaperType, string> = {
  matte:  "Premium Matte",
  cotton: "Fine Art Cotton",
  baryta: "Baryta",
};

export const PAPER_TYPE_DESCRIPTIONS: Record<PaperType, string> = {
  matte:  "Matte photo paper. No glare, good blacks, versatile. Best entry-tier option.",
  cotton: "Matte cotton rag, archival quality. Best for landscape and nature.",
  baryta: "Semi-glossy, deep blacks, darkroom feel. Ideal for wildlife and B&W.",
};

// ── Print size dimensions (mm) ────────────────────────────────────────────────
// [shortEdgeMm, longEdgeMm] — orientation-agnostic.
// "Panoramic" is variable-length (roll paper) — not listed here.

export const PRINT_SIZE_DIMS_MM: Record<Exclude<PrintSize, "Panoramic">, [number, number]> = {
  "A4":       [210, 297],
  "20×30 cm": [200, 300],
  "A3":       [297, 420],
  "30×40 cm": [300, 400],
  "A3+":      [320, 450],
  "40×60 cm": [400, 600],
  "50×70 cm": [500, 700],
  "A2":       [420, 594],
  "60×80 cm": [600, 800],
  "A2+":      [432, 610],
};

// ── Border widths (mm) ────────────────────────────────────────────────────────
// Package category determines border width for bordered presentation.

export type PackageCategory = "small" | "medium" | "large";

export const SIZE_PACKAGE_CATEGORY: Record<Exclude<PrintSize, "Panoramic">, PackageCategory> = {
  "A4":       "small",
  "20×30 cm": "small",
  "A3":       "small",
  "30×40 cm": "small",
  "A3+":      "medium",
  "40×60 cm": "medium",
  "50×70 cm": "medium",
  "A2":       "medium",
  "A2+":      "medium",
  "60×80 cm": "large",
};

export const BORDER_WIDTH_MM: Record<PackageCategory, number> = {
  small:  20,
  medium: 25,
  large:  30,
};

// Image area = paper minus 2× border on each axis, used for DPI check in bordered mode
export function getImageAreaMm(size: Exclude<PrintSize, "Panoramic">): { shortMm: number; longMm: number } {
  const [short, long] = PRINT_SIZE_DIMS_MM[size];
  const border = BORDER_WIDTH_MM[SIZE_PACKAGE_CATEGORY[size]];
  return { shortMm: short - 2 * border, longMm: long - 2 * border };
}

// ── Production costs (€ cents, excl. labour and shipping) ────────────────────
// [paperCost, inkCost, packagingCost] per size per paper type.
// Labour (€15) is added once per order at checkout, not per item.

type CostEntry = { paper: number; ink: number; packaging: number };

const PRODUCTION_COSTS_CENTS: Record<Exclude<PrintSize, "Panoramic">, Record<PaperType, CostEntry>> = {
  "A4": {
    matte:  { paper:  90, ink: 100, packaging: 200 },
    cotton: { paper: 180, ink: 100, packaging: 200 },
    baryta: { paper: 200, ink: 100, packaging: 200 },
  },
  "20×30 cm": {
    matte:  { paper:  85, ink: 110, packaging: 200 },
    cotton: { paper: 170, ink: 110, packaging: 200 },
    baryta: { paper: 190, ink: 110, packaging: 200 },
  },
  "A3": {
    matte:  { paper: 160, ink: 180, packaging: 250 },
    cotton: { paper: 320, ink: 180, packaging: 250 },
    baryta: { paper: 360, ink: 180, packaging: 250 },
  },
  "30×40 cm": {
    matte:  { paper: 150, ink: 190, packaging: 250 },
    cotton: { paper: 300, ink: 190, packaging: 250 },
    baryta: { paper: 340, ink: 190, packaging: 250 },
  },
  "A3+": {
    matte:  { paper: 200, ink: 220, packaging: 300 },
    cotton: { paper: 400, ink: 220, packaging: 300 },
    baryta: { paper: 450, ink: 220, packaging: 300 },
  },
  "40×60 cm": {
    matte:  { paper: 300, ink: 330, packaging: 350 },
    cotton: { paper: 580, ink: 330, packaging: 350 },
    baryta: { paper: 650, ink: 330, packaging: 350 },
  },
  "50×70 cm": {
    matte:  { paper: 350, ink: 380, packaging: 380 },
    cotton: { paper: 650, ink: 380, packaging: 380 },
    baryta: { paper: 700, ink: 380, packaging: 380 },
  },
  "A2": {
    matte:  { paper: 320, ink: 350, packaging: 350 },
    cotton: { paper: 600, ink: 350, packaging: 350 },
    baryta: { paper: 680, ink: 350, packaging: 350 },
  },
  "60×80 cm": {
    matte:  { paper:  600, ink: 650, packaging: 500 },
    cotton: { paper: 1150, ink: 650, packaging: 500 },
    baryta: { paper: 1300, ink: 650, packaging: 500 },
  },
  "A2+": {
    matte:  { paper: 340, ink: 380, packaging: 380 },
    cotton: { paper: 650, ink: 380, packaging: 380 },
    baryta: { paper: 720, ink: 380, packaging: 380 },
  },
};

// ── Price computation ─────────────────────────────────────────────────────────
// Retail price = (paper + ink + packaging) × MARKUP, rounded to nearest €5.
// Changing MARKUP reprices all prints.

function roundToNearest5Euros(cents: number): number {
  return Math.round(cents / 500) * 500;
}

function computeRetailCents(size: Exclude<PrintSize, "Panoramic">, paper: PaperType): number {
  const { paper: p, ink, packaging } = PRODUCTION_COSTS_CENTS[size][paper];
  return roundToNearest5Euros((p + ink + packaging) * MARKUP);
}

// Panoramic: proportional to A2 price, based on print length vs A2 long edge (594mm)
export function getPanoramicPriceCents(aspectRatio: number, paper: PaperType): number {
  const panoramicLengthMm = Math.round(432 * aspectRatio);
  const a2LengthMm = 594;
  const a2Price = computeRetailCents("A2", paper);
  return roundToNearest5Euros(a2Price * (panoramicLengthMm / a2LengthMm));
}

export function getPriceCents(size: PrintSize, paper: PaperType, aspectRatio?: number): number {
  if (size === "Panoramic") {
    if (aspectRatio === undefined) throw new Error("aspectRatio required for Panoramic price");
    return getPanoramicPriceCents(aspectRatio, paper);
  }
  return computeRetailCents(size, paper);
}

export function getPanoramicLengthMm(aspectRatio: number): number {
  return Math.round(432 * aspectRatio);
}

// ── Presentation style ────────────────────────────────────────────────────────

export type PresentationStyle = "bordered" | "borderless";

// ── Availability logic ────────────────────────────────────────────────────────

export const MIN_PRINT_DPI = 200;
export const ASPECT_RATIO_TOLERANCE = 0.07; // ±7% relative, borderless only

// Panoramic threshold: offer when 432 × aspectRatio > A2 long edge (594mm)
const PANORAMIC_RATIO_THRESHOLD = 594 / 432; // ≈ 1.375

export function getAvailableSizes(
  widthPx: number,
  heightPx: number,
  aspectRatio: number,
  style: PresentationStyle
): PrintSize[] {
  const longPx = Math.max(widthPx, heightPx);
  const sizes: PrintSize[] = [];

  for (const size of Object.keys(PRINT_SIZE_DIMS_MM) as Exclude<PrintSize, "Panoramic">[]) {
    const [short, long] = PRINT_SIZE_DIMS_MM[size];
    const longMm = Math.max(short, long);
    const shortMm = Math.min(short, long);
    const paperAspect = longMm / shortMm;

    if (style === "borderless") {
      // Resolution: long edge must meet 200 DPI against paper long edge
      const requiredPx = (longMm / 25.4) * MIN_PRINT_DPI;
      if (longPx < requiredPx) continue;
      // Aspect ratio: must match paper within ±7%
      const ratioDiff = Math.abs(aspectRatio - paperAspect) / paperAspect;
      if (ratioDiff > ASPECT_RATIO_TOLERANCE) continue;
    } else {
      // bordered: resolution check against image area (not full paper)
      const imageArea = getImageAreaMm(size);
      const requiredPx = (imageArea.longMm / 25.4) * MIN_PRINT_DPI;
      if (longPx < requiredPx) continue;
      // No aspect ratio check — border absorbs any ratio difference
    }

    sizes.push(size);
  }

  // Panoramic (roll paper): only for wide images where long edge exceeds A2
  if (aspectRatio > PANORAMIC_RATIO_THRESHOLD) {
    const panoramicLongPx = (getPanoramicLengthMm(aspectRatio) / 25.4) * MIN_PRINT_DPI;
    const panoramicShortPx = (432 / 25.4) * MIN_PRINT_DPI;
    if (longPx >= panoramicLongPx && longPx >= panoramicShortPx) {
      sizes.push("Panoramic");
    }
  }

  return sizes;
}

// ── Shipping ──────────────────────────────────────────────────────────────────

export type ShippingZone = "NL" | "BE" | "EUR1" | "EUR2" | "UK" | "US" | "ROW";

// ISO 3166-1 alpha-2 → shipping zone (server-side only)
const COUNTRY_ZONE: Record<string, ShippingZone> = {
  NL: "NL",
  BE: "BE",
  DE: "EUR1", FR: "EUR1", AT: "EUR1", ES: "EUR1", IT: "EUR1",
  SE: "EUR1", DK: "EUR1", LU: "EUR1",
  PL: "EUR2", CZ: "EUR2", HU: "EUR2", RO: "EUR2", BG: "EUR2",
  HR: "EUR2", SK: "EUR2", SI: "EUR2", EE: "EUR2", LV: "EUR2",
  LT: "EUR2", FI: "EUR2", IE: "EUR2", PT: "EUR2", GR: "EUR2",
  CY: "EUR2", MT: "EUR2",
  GB: "UK",
  US: "US", CA: "US",
};

export function getShippingZone(countryCode: string): ShippingZone {
  return COUNTRY_ZONE[countryCode.toUpperCase()] ?? "ROW";
}

// Shipping costs in cents per zone × package category
export const SHIPPING_COSTS_CENTS: Record<ShippingZone, Record<PackageCategory, number>> = {
  NL:   { small:  635, medium:  745, large:  745 },
  BE:   { small:  950, medium: 1000, large: 1375 },
  EUR1: { small: 1000, medium: 1100, large: 1450 },
  EUR2: { small: 1200, medium: 1400, large: 1800 },
  UK:   { small: 1200, medium: 1400, large: 2200 },
  US:   { small: 2100, medium: 2600, large: 3600 },
  ROW:  { small: 2500, medium: 3200, large: 4500 },
};

export function getShippingCents(countryCode: string, category: PackageCategory): number {
  const zone = getShippingZone(countryCode);
  return SHIPPING_COSTS_CENTS[zone][category];
}

export function getSizePackageCategory(size: PrintSize): PackageCategory {
  if (size === "Panoramic") return "large";
  return SIZE_PACKAGE_CATEGORY[size];
}

// Cart-level package category = largest category across all print items
export function getOrderPackageCategory(sizes: PrintSize[]): PackageCategory {
  const rank: Record<PackageCategory, number> = { small: 0, medium: 1, large: 2 };
  return sizes.reduce<PackageCategory>((max, size) => {
    const cat = getSizePackageCategory(size);
    return rank[cat] > rank[max] ? cat : max;
  }, "small");
}

// ── Postcard ──────────────────────────────────────────────────────────────────

export const POSTCARD_PRICE_CENTS = 500; // €5.00

// ── VAT ───────────────────────────────────────────────────────────────────────
// Photography prints qualify for 9% BTW (reduced Dutch artwork rate), not 21%.
// All prices above are excl. VAT. Apply at checkout display layer.

export const VAT_RATE = 0.09;

export function addVat(cents: number): number {
  return Math.round(cents * (1 + VAT_RATE));
}

// ── Formatting ────────────────────────────────────────────────────────────────

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
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
  presentationStyle: PresentationStyle;
  panoramicLengthMm?: number; // only set when size === "Panoramic"
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
