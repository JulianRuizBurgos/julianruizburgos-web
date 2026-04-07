import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery — Julian Ruiz Burgos",
  description: "Shipping zones, delivery times, and costs for print orders.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Legal</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900">Shipping &amp; Delivery</h1>
      <div className="mt-2 h-0.5 w-12 bg-terracotta-400" />
      <p className="mt-4 text-sm text-earth-400">Last updated: April 2026</p>

      <div className="prose-content mt-10">

        <h2>Dispatch time</h2>
        <p>
          All prints are produced to order. Orders are dispatched within{" "}
          <strong>3–5 business days</strong> of payment confirmation. You will receive a
          shipping notification with a PostNL track-and-trace number once your order is on
          its way.
        </p>
        <p>
          During busy periods (for example November and December) dispatch may take slightly
          longer. If you need a print by a specific date, please contact us before ordering
          at{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>.
        </p>

        <h2>Estimated delivery times</h2>
        <p>
          The table below shows estimated total delivery times from the date you place your
          order (dispatch time included). All shipments include PostNL track-and-trace.
        </p>

        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-earth-200">
                <th className="py-2 pr-6 text-left font-semibold text-earth-900">Destination</th>
                <th className="py-2 text-left font-semibold text-earth-900">Estimated delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">Netherlands</td>
                <td className="py-2.5 text-earth-600">4–6 business days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">Belgium &amp; Germany</td>
                <td className="py-2.5 text-earth-600">5–9 business days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">Rest of EU</td>
                <td className="py-2.5 text-earth-600">6–12 business days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">United Kingdom</td>
                <td className="py-2.5 text-earth-600">8–15 business days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">USA &amp; Canada</td>
                <td className="py-2.5 text-earth-600">10–19 business days</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 text-earth-900">Rest of World</td>
                <td className="py-2.5 text-earth-600">13–25 business days</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          Delivery times are estimates provided by PostNL and are not guaranteed. We cannot
          be held responsible for delays caused by the carrier, customs processing, or
          circumstances outside our control.
        </p>

        <h2>Shipping costs</h2>
        <p>
          Shipping costs depend on your delivery country and the size of your order. The
          exact cost will be calculated and shown at checkout before you complete your
          purchase. We do not profit from shipping — costs reflect PostNL&rsquo;s published
          tariffs.
        </p>

        <h2>Packaging</h2>
        <p>
          Smaller prints (up to 30×40 cm) are shipped flat in rigid cardboard mailers.
          Larger prints are shipped in postal tubes. All packaging is designed to protect
          the print in transit — if your order arrives damaged, please see our{" "}
          <a href="/legal/returns">Returns &amp; Refunds</a> page.
        </p>

        <h2>Customs and import duties (non-EU orders)</h2>
        <p>
          For orders delivered outside the European Union — including the United Kingdom —
          customs duties, import taxes, or handling fees may be charged by the destination
          country. These charges are not included in our prices and are the
          recipient&rsquo;s responsibility. We have no control over customs procedures and
          cannot predict what charges, if any, will apply.
        </p>
        <p>
          UK buyers: since Brexit, all imports from the EU are subject to UK customs
          clearance. Most small-value personal imports (under £135) are not subject to
          customs duty, but VAT may apply. Royal Mail or your courier will contact you if a
          charge is due.
        </p>

      </div>
    </div>
  );
}
