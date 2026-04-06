import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Prints — Julian Ruiz Burgos",
  description:
    "Everything you need to know about print sizes, paper types, and presentation styles before ordering.",
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t-2 border-earth-900 pt-8 pb-10">
      <h2 className="font-serif text-2xl font-semibold text-earth-900 mb-5">{title}</h2>
      {children}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded border border-earth-200 bg-earth-100 px-4 py-3 text-sm text-earth-700 leading-relaxed">
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPrintingPage() {
  return (
    <main className="min-h-screen bg-earth-50 pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-6">

        {/* Header */}
        <div className="pt-20 pb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-3">
            Printing guide
          </p>
          <h1 className="font-serif text-4xl font-semibold text-earth-900 leading-tight">
            About print sizes, paper &amp; presentation
          </h1>
          <p className="mt-4 text-base text-earth-600 leading-relaxed max-w-lg">
            Every print is produced by Julian on a professional Epson SC-P900 photo printer.
            Here is everything you need to make the right choice for your space.
          </p>
        </div>

        {/* ── Presentation style ── */}
        <Section title="With border or borderless?">
          <p className="text-sm text-earth-700 leading-relaxed mb-6">
            Each print can be produced in one of two presentation styles — at the same price.
            The choice affects how the image fills the paper and which sizes are available to you.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bordered */}
            <div className="rounded border-2 border-earth-900 p-5">
              <div className="flex items-start gap-3 mb-3">
                {/* Visual: image centred with white margin */}
                <div className="shrink-0 w-12 h-16 border border-earth-300 bg-white flex items-center justify-center">
                  <div className="w-7 h-9 bg-earth-400" />
                </div>
                <div>
                  <p className="font-semibold text-earth-900 text-sm">With white border</p>
                  <p className="text-xs text-terracotta-600 font-medium mt-0.5">Recommended for framing</p>
                </div>
              </div>
              <p className="text-sm text-earth-700 leading-relaxed">
                The image is printed smaller than the paper, centred with a clean white margin on all
                sides — exactly as you see prints in galleries and museums. The border protects the
                image edge when framed and allows re-matting without touching the print.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-earth-600">
                <li>✓ More sizes available (border absorbs ratio differences)</li>
                <li>✓ Classical fine art presentation</li>
                <li>✓ Easier to re-mat and re-frame later</li>
              </ul>
            </div>

            {/* Borderless */}
            <div className="rounded border border-earth-300 p-5">
              <div className="flex items-start gap-3 mb-3">
                {/* Visual: image fills frame edge to edge */}
                <div className="shrink-0 w-12 h-16 bg-earth-400 flex items-center justify-center">
                  <span className="text-white text-[9px] font-medium text-center leading-tight">edge<br/>to<br/>edge</span>
                </div>
                <div>
                  <p className="font-semibold text-earth-900 text-sm">Borderless</p>
                  <p className="text-xs text-earth-500 font-medium mt-0.5">Full-bleed</p>
                </div>
              </div>
              <p className="text-sm text-earth-700 leading-relaxed">
                The image fills the paper completely, edge to edge. Best when you have a specific
                frame in mind and want the image to fill it without any white space.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-earth-600">
                <li>✓ Maximum visual impact</li>
                <li>✓ Poster / commercial style</li>
                <li>— Fewer sizes available (aspect ratio must match)</li>
              </ul>
            </div>
          </div>

          <Note>
            <strong>Border widths:</strong> 20 mm for sizes up to 30×40 cm, 25 mm for larger sizes,
            30 mm for 60×80 cm. Equal margins on all four sides. The actual image dimensions for
            each size are shown in the print selector when you choose &ldquo;With white border&rdquo;.
          </Note>
        </Section>

        {/* ── Print sizes ── */}
        <Section title="Print sizes">
          <p className="text-sm text-earth-700 leading-relaxed mb-6">
            Sizes are offered in two tiers based on how well they match the native 4:3 aspect ratio
            of the Olympus camera used for most of these photographs.
          </p>

          <h3 className="font-semibold text-earth-900 text-sm uppercase tracking-wider mb-3">
            Primary sizes — image fills the paper
          </h3>
          <p className="text-sm text-earth-600 mb-4">
            These sizes match the 4:3 camera ratio exactly or near-exactly. The image fills the paper
            completely (borderless) or is surrounded by balanced white margins (bordered). No visible
            crop required. These are the best choices for wall display.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-earth-900">
                  <th className="text-left py-2 pr-4 font-semibold text-earth-900">Size</th>
                  <th className="text-left py-2 pr-4 font-semibold text-earth-900">Dimensions</th>
                  <th className="text-left py-2 pr-4 font-semibold text-earth-900">Frames</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-200">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">30×40 cm ✓</td>
                  <td className="py-2.5 pr-4 text-earth-600">300 × 400 mm</td>
                  <td className="py-2.5 text-earth-600">IKEA Ribba, HEMA — most popular in NL</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">50×70 cm</td>
                  <td className="py-2.5 pr-4 text-earth-600">500 × 700 mm</td>
                  <td className="py-2.5 text-earth-600">Very popular NL/EU poster size</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">60×80 cm ✓</td>
                  <td className="py-2.5 pr-4 text-earth-600">600 × 800 mm</td>
                  <td className="py-2.5 text-earth-600">Statement piece — specialty framers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-earth-900 text-sm uppercase tracking-wider mb-3">
            Secondary sizes — A-series &amp; other formats
          </h3>
          <p className="text-sm text-earth-600 mb-4">
            ISO A-series paper follows a different ratio (√2:1 ≈ 1.41) than the camera&apos;s 4:3.
            In borderless mode this means a minor crop; in bordered mode the asymmetric margin
            is small and considered a classical fine art presentation.
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-earth-900">
                  <th className="text-left py-2 pr-4 font-semibold text-earth-900">Size</th>
                  <th className="text-left py-2 pr-4 font-semibold text-earth-900">Dimensions</th>
                  <th className="text-left py-2 font-semibold text-earth-900">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-200">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">A4</td>
                  <td className="py-2.5 pr-4 text-earth-600">210 × 297 mm</td>
                  <td className="py-2.5 text-earth-600">Universal frames everywhere</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">20×30 cm</td>
                  <td className="py-2.5 pr-4 text-earth-600">200 × 300 mm</td>
                  <td className="py-2.5 text-earth-600">IKEA, HEMA, Xenos</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">A3</td>
                  <td className="py-2.5 pr-4 text-earth-600">297 × 420 mm</td>
                  <td className="py-2.5 text-earth-600">Universal</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">A3+</td>
                  <td className="py-2.5 pr-4 text-earth-600">320 × 450 mm</td>
                  <td className="py-2.5 text-earth-600">Super A3 — specialty stores</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">40×60 cm</td>
                  <td className="py-2.5 pr-4 text-earth-600">400 × 600 mm</td>
                  <td className="py-2.5 text-earth-600">Visible crop in borderless — see note</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">A2</td>
                  <td className="py-2.5 pr-4 text-earth-600">420 × 594 mm</td>
                  <td className="py-2.5 text-earth-600">Large format — specialty stores</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-earth-900">A2+</td>
                  <td className="py-2.5 pr-4 text-earth-600">432 × 610 mm</td>
                  <td className="py-2.5 text-earth-600">Maximum cut sheet — printer limit</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Note>
            <strong>40×60 cm (borderless):</strong> This 3:2 ratio differs by ~11% from the
            camera&apos;s 4:3, which results in a visible crop. It is not offered in borderless
            mode for most photos. In bordered mode it is available, and the white border frames
            the full 4:3 image without any cropping.
          </Note>

          <div className="mt-6 rounded border border-earth-300 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-earth-500 mb-2">Panoramic roll prints</p>
            <p className="text-sm text-earth-700 leading-relaxed">
              For wide-format photographs with an aspect ratio greater than roughly 1.4:1 — such as
              stitched panoramas or ultra-wide crops — a panoramic roll print is offered alongside
              the standard sizes. The print is 432 mm wide (17&Prime;, the full printer width) and as
              long as the image naturally requires. The exact dimensions are shown per photograph in
              the print selector.
            </p>
          </div>
        </Section>

        {/* ── Paper types ── */}
        <Section title="Paper types">
          <p className="text-sm text-earth-700 leading-relaxed mb-6">
            Three paper tiers are available, from a versatile matte entry option to museum-grade
            archival materials. All are printed with Epson UltraChrome Pro 10 pigment inks, which
            are rated for 100+ years of display life under glass.
          </p>

          <div className="flex flex-col gap-4">
            {/* Matte */}
            <div className="rounded border border-earth-300 p-5">
              <p className="font-semibold text-earth-900 mb-1">Premium Matte</p>
              <p className="text-xs text-earth-500 mb-3">Epson Enhanced Matte · Canson BFK Rives</p>
              <p className="text-sm text-earth-700 leading-relaxed">
                A high-quality coated matte surface with no glare — the most versatile option.
                Good maximum black density, accurate colour reproduction, and handles well under
                any lighting. A great choice if you are new to fine art prints or prefer a clean,
                understated look.
              </p>
            </div>

            {/* Cotton */}
            <div className="rounded border-2 border-earth-900 p-5">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-earth-900">Fine Art Cotton</p>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 border border-terracotta-200 px-2 py-0.5 rounded">
                  Flagship
                </span>
              </div>
              <p className="text-xs text-earth-500 mb-3">Hahnemühle Photo Rag 308g</p>
              <p className="text-sm text-earth-700 leading-relaxed">
                100% cotton rag, museum-grade archival paper with a soft, slightly textured matte
                surface. This is what you see in gallery exhibitions. The texture adds tactile
                depth and makes landscape and nature photographs feel tangible. The recommended
                choice for most of these photographs.
              </p>
            </div>

            {/* Baryta */}
            <div className="rounded border border-earth-300 p-5">
              <p className="font-semibold text-earth-900 mb-1">Baryta</p>
              <p className="text-xs text-earth-500 mb-3">Hahnemühle FineArt Baryta 325g</p>
              <p className="text-sm text-earth-700 leading-relaxed">
                A semi-gloss finish that replicates the look and feel of traditional fibre-based
                darkroom prints (baryta paper). Deep, rich blacks and exceptional tonal range.
                Ideal for wildlife, B&amp;W, and high-contrast photographs. The surface has a
                subtle sheen without the mirror-like quality of glossy paper.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Fulfilment ── */}
        <Section title="How prints are made and shipped">
          <div className="flex flex-col gap-4 text-sm text-earth-700 leading-relaxed">
            <p>
              Every print is made by hand, one at a time. Julian prints each order personally on
              the Epson SC-P900 — a professional 17-inch photo printer — inspects it for colour
              accuracy and surface quality, and packages it carefully before shipping.
            </p>
            <p>
              Prints up to 30×40 cm are shipped flat in a rigid protective mailer. Larger prints
              travel in a postal tube. All shipments include tracking. Shipping cost is calculated
              at checkout based on your delivery country.
            </p>
            <p>
              Because each print is produced on demand, please allow a few days for production
              before dispatch. You will receive a dispatch notification with tracking details.
            </p>
          </div>
        </Section>

        {/* ── Back link ── */}
        <div className="pt-4">
          <a
            href="/photography"
            className="text-sm text-earth-600 underline underline-offset-2 hover:text-earth-900 transition-colors"
          >
            ← Back to the gallery
          </a>
        </div>

      </div>
    </main>
  );
}
