import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Julian Ruiz Burgos",
  description: "Terms and conditions for print orders placed at julianruizburgos.net.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Legal</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900">Terms &amp; Conditions</h1>
      <div className="mt-2 h-0.5 w-12 bg-terracotta-400" />
      <p className="mt-4 text-sm text-earth-400">Last updated: April 2026</p>

      <div className="prose-content mt-10">

        <h2>1. Who we are</h2>
        <p>
          This online shop is operated by Ruiz Burgos Ecology and Software, Steversemolen 48,
          5612 DV Eindhoven, Netherlands. KvK (Chamber of Commerce) number: 98713698. BTW
          (VAT) number: NL005348430B65. Contact:{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>.
        </p>

        <h2>2. Products</h2>
        <p>
          We sell fine art photography prints and printed postcards. All prints are produced
          by hand in Eindhoven on archival-quality paper using an Epson pigment ink printer.
          Prints are open edition — there is no fixed maximum number of prints per image.
        </p>
        <p>
          Each print is produced to order after payment is confirmed. We do not hold finished
          prints in stock.
        </p>

        <h2>3. Prices and VAT</h2>
        <p>
          All prices on this website are in euros (€) and are stated excluding VAT. Ruiz
          Burgos Ecology and Software participates in the Dutch{" "}
          <strong>Kleine Ondernemersregeling (KOR)</strong> scheme and is therefore exempt
          from charging VAT. No VAT is added to your order.
        </p>
        <p>
          Shipping costs are not included in the product price. The applicable shipping cost
          for your delivery country will be shown at checkout before you complete your
          purchase.
        </p>

        <h2>4. Ordering and payment</h2>
        <p>
          An order is placed when you complete the checkout process and payment is confirmed.
          You will receive an order confirmation by email. We reserve the right to cancel an
          order if payment fails to complete or if the product is no longer available, in
          which case you will be fully refunded.
        </p>
        <p>
          Payment is processed by <strong>Mollie B.V.</strong>, a licensed Dutch payment
          institution. Accepted methods include iDEAL, credit and debit cards, and other
          payment methods shown at checkout. We never handle or store your payment details
          directly.
        </p>

        <h2>5. Delivery</h2>
        <p>
          Orders are dispatched within <strong>3–5 business days</strong> of payment
          confirmation. Estimated delivery times after dispatch depend on your location — see
          our <Link href="/legal/shipping">Shipping &amp; Delivery</Link> page for full
          details by destination zone.
        </p>
        <p>
          Delivery times are estimates provided by PostNL and are not guaranteed. We are not
          liable for delays caused by the carrier, customs processing, or circumstances
          outside our control.
        </p>
        <p>
          For orders outside the EU (including the United Kingdom), customs duties and import
          taxes may apply. These charges are the responsibility of the recipient and are not
          included in our prices or shipping costs.
        </p>

        <h2>6. Returns and right of withdrawal</h2>
        <p>
          Because prints are produced to order, they are considered goods made to the
          consumer&rsquo;s specifications under Art. 6:230p sub e of the Dutch Civil Code
          (Burgerlijk Wetboek). The statutory 14-day right of withdrawal therefore does not
          apply.
        </p>
        <p>
          However, if you are not satisfied with your print for any reason other than damage
          in transit, please contact us at{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>{" "}
          within <strong>14 days of delivery</strong>. We will consider each case and aim to
          find a fair resolution. Return shipping costs in this case are the buyer&rsquo;s
          responsibility.
        </p>
        <p>
          For damaged or faulty goods, see our{" "}
          <Link href="/legal/returns">Returns &amp; Refunds</Link> policy.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          We are not liable for indirect or consequential losses arising from your use of
          this website or from orders placed through it. Our total liability for any claim
          arising from a purchase is limited to the amount paid for the relevant order.
          Nothing in these terms limits our liability for death, personal injury, or fraud.
        </p>

        <h2>8. Governing law</h2>
        <p>
          These terms are governed by Dutch law. Any disputes that cannot be resolved
          amicably will be submitted to the competent court in the Netherlands. If you are a
          consumer resident in another EU member state, you retain the protection afforded
          by mandatory consumer protection provisions in your country of residence.
        </p>
        <p>
          Disputes may also be submitted to the EU Online Dispute Resolution platform at{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          . We are not obliged to participate in alternative dispute resolution proceedings,
          but we will consider requests case by case.
        </p>

        <h2>9. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The date at the top of the page
          reflects the most recent revision. Orders are governed by the terms in force at
          the time of purchase.
        </p>

      </div>
    </div>
  );
}
