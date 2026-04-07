import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds — Julian Ruiz Burgos",
  description: "Our returns and refund policy for print orders.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Legal</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900">Returns &amp; Refunds</h1>
      <div className="mt-2 h-0.5 w-12 bg-terracotta-400" />
      <p className="mt-4 text-sm text-earth-400">Last updated: April 2026</p>

      <div className="prose-content mt-10">

        <h2>Prints produced to order</h2>
        <p>
          All prints are produced to order after payment is confirmed. Because of this, the
          standard EU 14-day right of withdrawal does not apply (Art. 6:230p sub e, Dutch
          Civil Code). However, we want you to be happy with your purchase — if something is
          wrong, please get in touch.
        </p>

        <h2>Damaged or faulty goods</h2>
        <p>
          If your print arrives damaged — whether due to transit or a fault in the print
          itself — you are entitled to a <strong>free reprint or a full refund</strong>,
          whichever you prefer. We bear full legal responsibility for your order arriving in
          good condition regardless of who caused the damage.
        </p>
        <p>To report a damaged order, please:</p>
        <ol>
          <li>
            Email us at{" "}
            <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>{" "}
            within <strong>7 calendar days of delivery</strong>.
          </li>
          <li>
            Include your order number and <strong>clear photographs</strong> of both the
            damaged packaging and the damaged print. These are required for us to file a
            claim with PostNL.
          </li>
          <li>
            Tell us whether you would prefer a reprint or a refund. We will process your
            preferred remedy promptly.
          </li>
        </ol>
        <p>
          If you discover damage later than 7 days after delivery, please still contact us —
          we will consider each case individually.
        </p>

        <h2>Reprints</h2>
        <p>
          A replacement print will be dispatched within 3–5 business days of us confirming
          the damage. You do not need to return the damaged print in most cases, though we
          may ask you to hold on to the packaging for PostNL inspection.
        </p>

        <h2>Refunds</h2>
        <p>
          Refunds are issued to the original payment method via Mollie. Please allow 5–10
          business days for the refund to appear on your statement after we confirm it.
        </p>

        <h2>Change of mind</h2>
        <p>
          If you are not satisfied with your print for a reason other than damage or
          fault, please contact us within 14 days of delivery. We will consider your request
          and aim to find a fair resolution. If a return is agreed, the print must be
          returned in its original undamaged condition and return shipping costs are the
          buyer&rsquo;s responsibility.
        </p>

        <h2>Postcards</h2>
        <p>
          Postcard orders are personalised items (custom message, specific recipient). They
          cannot be returned or refunded once written and mailed. If your postcard does not
          arrive, please contact us and we will investigate with PostNL.
        </p>

        <h2>Contact</h2>
        <p>
          For any returns or refunds enquiry:{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>
        </p>

      </div>
    </div>
  );
}
