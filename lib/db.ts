import { Pool } from "pg";

// ── Connection pool ───────────────────────────────────────────────────────────

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

// ── Schema ────────────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_id   TEXT NOT NULL UNIQUE,
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  shipping_name       TEXT,
  shipping_address1   TEXT,
  shipping_address2   TEXT,
  shipping_city       TEXT,
  shipping_postcode   TEXT,
  shipping_country    TEXT,
  subtotal_cents      INTEGER NOT NULL,
  shipping_cents      INTEGER NOT NULL DEFAULT 0,
  total_cents         INTEGER NOT NULL,
  status              TEXT NOT NULL DEFAULT 'paid',
  tracking_number     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  photo_filename        TEXT NOT NULL,
  photo_title           TEXT NOT NULL,
  product_type          TEXT NOT NULL CHECK (product_type IN ('print', 'postcard', 'blank-postcard')),
  size                  TEXT,
  paper_type            TEXT,
  presentation_style    TEXT CHECK (presentation_style IN ('bordered', 'borderless')),
  panoramic_length_mm   INTEGER,
  price_cents           INTEGER NOT NULL,
  quantity              INTEGER NOT NULL DEFAULT 1,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS postcard_details (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id       UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  recipient_name      TEXT NOT NULL,
  address_line1       TEXT NOT NULL,
  address_line2       TEXT,
  city                TEXT NOT NULL,
  postcode            TEXT NOT NULL,
  country             TEXT NOT NULL,
  message_text        TEXT NOT NULL,
  text_style          TEXT NOT NULL CHECK (text_style IN ('handwritten', 'printed')),
  sender_name         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

-- Migration: extend product_type check to include blank-postcard
DO $$
BEGIN
  ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_type_check;
  ALTER TABLE order_items ADD CONSTRAINT order_items_product_type_check
    CHECK (product_type IN ('print', 'postcard', 'blank-postcard'));
EXCEPTION WHEN OTHERS THEN NULL;
END;
$$;

-- Migration: add refunded as a valid order status (orders has no check constraint — status is free text)
-- No DDL change needed; this comment documents the accepted values: 'paid', 'dispatched', 'refunded'
`;

let schemaInitialised = false;

export async function initSchema(): Promise<void> {
  if (schemaInitialised) return;
  await getPool().query(SCHEMA_SQL);
  schemaInitialised = true;
}

// ── Order types (for admin/webhook use) ──────────────────────────────────────

export interface Order {
  id: string;
  stripe_payment_id: string;
  customer_name: string;
  customer_email: string;
  shipping_name: string | null;
  shipping_address1: string | null;
  shipping_address2: string | null;
  shipping_city: string | null;
  shipping_postcode: string | null;
  shipping_country: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: string;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  photo_filename: string;
  photo_title: string;
  product_type: "print" | "postcard" | "blank-postcard";
  size: string | null;
  paper_type: string | null;
  presentation_style: "bordered" | "borderless" | null;
  panoramic_length_mm: number | null;
  price_cents: number;
  quantity: number;
}

export interface PostcardDetail {
  id: string;
  order_item_id: string;
  recipient_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  country: string;
  message_text: string;
  text_style: "handwritten" | "printed";
  sender_name: string;
}
