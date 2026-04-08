"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import {
  formatPrice,
  getShippingCents,
  getOrderPackageCategory,
  getSizePackageCategory,
  PAPER_TYPE_LABELS,
  type PaperType,
} from "@/lib/shop";

// ── Country list (display name → ISO 3166-1 alpha-2) ─────────────────────────

const COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (DRC)" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

// ── Shipping form ─────────────────────────────────────────────────────────────

interface ShippingFields {
  name: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
}

const EMPTY_SHIPPING: ShippingFields = {
  name: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  country: "NL",
};

// ── Main checkout page ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalCents } = useCart();

  const [shipping, setShipping] = useState<ShippingFields>(EMPTY_SHIPPING);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const hasPrints = items.some((i) => i.type === "print" || i.type === "blank-postcard");
  const printSizes = items
    .filter((i) => i.type === "print")
    .map((i) => (i as Extract<typeof items[number], { type: "print" }>).size);
  const packageCategory = printSizes.length > 0 ? getOrderPackageCategory(printSizes) : "small";
  const printShippingCents = hasPrints ? getShippingCents(shipping.country || "NL", packageCategory) : 0;
  const postcardMailingCents = items
    .filter((i) => i.type === "postcard")
    .reduce((sum, i) => {
      const pc = i as Extract<typeof items[number], { type: "postcard" }>;
      return sum + (pc.country.toUpperCase() === "NL" ? 0 : 200);
    }, 0);
  const shipping_cents = printShippingCents + postcardMailingCents;
  const grandTotalCents = totalCents + shipping_cents;

  function set(key: keyof ShippingFields, value: string) {
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  const formValid =
    shipping.name.trim() &&
    shipping.email.trim() &&
    (!hasPrints ||
      (shipping.address1.trim() &&
        shipping.city.trim() &&
        shipping.postcode.trim() &&
        shipping.country.trim()));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid || items.length === 0) return;
    setLoading(true);
    setApiError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        shipping: hasPrints ? shipping : null,
        customerName: shipping.name,
        customerEmail: shipping.email,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setApiError(body.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const { checkoutUrl, paymentId } = await res.json();
    if (paymentId) sessionStorage.setItem("mollie_payment_id", paymentId);
    // Full redirect to Mollie's hosted payment page
    window.location.href = checkoutUrl;
  }

  if (items.length === 0) {
    return (
      <div className="bg-earth-50 min-h-screen pt-28 px-6">
        <div className="max-w-lg mx-auto py-20 text-center">
          <p className="font-serif text-3xl text-earth-900">Your cart is empty.</p>
          <Link
            href="/photography"
            className="mt-8 inline-block text-sm text-[#1068b6] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Browse Photography →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-earth-50 min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-600">
            Photography & Prints
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-earth-900">
            Checkout.
          </h1>
        </div>

        {/* Order summary */}
        <div className="mb-8 border-t-2 border-earth-300 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth-600">
            Order summary
          </p>
          <div className="flex flex-col gap-1.5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-earth-700">
                  {item.photoTitle}
                  {item.type === "print"
                    ? ` — ${item.size}, ${PAPER_TYPE_LABELS[item.paper as PaperType] ?? item.paper}`
                    : " — Postcard"}
                </span>
                <span className="text-earth-900 font-medium">
                  {formatPrice(item.priceCents)}
                </span>
              </div>
            ))}
          </div>
          {hasPrints && (
            <div className="mt-2 flex justify-between text-sm border-t border-earth-100 pt-2">
              <span className="text-earth-600">Shipping</span>
              <span className="text-earth-900">{formatPrice(shipping_cents)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-earth-200 pt-3">
            <span className="font-semibold text-earth-900">Total</span>
            <span className="font-serif text-lg font-semibold text-earth-900">
              {formatPrice(grandTotalCents)}
            </span>
          </div>
        </div>

        {/* Contact + shipping form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="border-t-2 border-earth-900 pt-5">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-earth-600">
              Contact
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-earth-600 uppercase tracking-wider">
                  Full name
                </label>
                <input
                  required
                  value={shipping.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-earth-600 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={shipping.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {hasPrints && (
            <div className="border-t border-earth-200 pt-4">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-earth-600">
                Shipping address
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-earth-600 uppercase tracking-wider">
                    Address
                  </label>
                  <input
                    required
                    value={shipping.address1}
                    onChange={(e) => set("address1", e.target.value)}
                    placeholder="Street and number"
                    className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                  />
                  <input
                    value={shipping.address2}
                    onChange={(e) => set("address2", e.target.value)}
                    placeholder="Apartment, floor, etc. (optional)"
                    className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-earth-600 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      required
                      value={shipping.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-earth-600 uppercase tracking-wider">
                      Postcode
                    </label>
                    <input
                      required
                      value={shipping.postcode}
                      onChange={(e) => set("postcode", e.target.value)}
                      className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 placeholder:text-earth-400 focus:border-[#1068b6] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-earth-600 uppercase tracking-wider">
                    Country
                  </label>
                  <select
                    required
                    value={shipping.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="rounded border border-earth-200 bg-white px-3 py-2.5 text-sm text-earth-900 focus:border-[#1068b6] focus:outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {apiError && (
            <p className="rounded border border-terracotta-400/40 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-600">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={!formValid || loading}
            className="rounded bg-earth-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-earth-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting to payment…" : `Pay ${formatPrice(grandTotalCents)}`}
          </button>

          <Link
            href="/cart"
            className="text-center text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
          >
            ← Back to cart
          </Link>
        </form>
      </div>
    </div>
  );
}
