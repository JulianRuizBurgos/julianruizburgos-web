import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Julian Ruiz Burgos",
  description: "How we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Legal</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900">Privacy Policy</h1>
      <div className="mt-2 h-0.5 w-12 bg-terracotta-400" />
      <p className="mt-4 text-sm text-earth-400">Last updated: April 2026</p>

      <div className="prose-content mt-10">

        <h2>Who we are</h2>
        <p>
          This website is operated by Ruiz Burgos Ecology and Software, Steversemolen 48,
          5612 DV Eindhoven, Netherlands (KvK 98713698). References to &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo; in this policy refer to that entity.
          You can contact us at{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>.
        </p>

        <h2>What data we collect and why</h2>
        <p>When you place an order, we collect:</p>
        <ul>
          <li>
            <strong>Name and delivery address</strong> — to ship your order and address
            postcard orders correctly.
          </li>
          <li>
            <strong>Email address</strong> — to send you an order confirmation and shipping
            notification.
          </li>
          <li>
            <strong>Payment information</strong> — processed directly by Mollie B.V., our
            payment provider. We never see or store your card number or bank account details.
          </li>
          <li>
            <strong>Postcard message and recipient details</strong> (postcard orders only) —
            to write and address the card on your behalf.
          </li>
        </ul>
        <p>
          We process this data on the legal basis of <strong>contract performance</strong>{" "}
          (GDPR Art. 6(1)(b)) — it is necessary to fulfil your order. We do not use it for
          marketing and we do not sell it to third parties.
        </p>

        <h2>Third parties we share data with</h2>
        <ul>
          <li>
            <strong>Mollie B.V.</strong> (payment processing) — receives payment details
            to authorise and process your payment. Mollie is a licensed payment institution
            regulated by De Nederlandsche Bank. Their privacy policy is available at
            mollie.com.
          </li>
          <li>
            <strong>PostNL</strong> (shipping) — receives your name and delivery address to
            generate a shipping label and deliver your order.
          </li>
          <li>
            <strong>Resend</strong> (transactional email) — receives your email address and
            order details to deliver your order confirmation email.
          </li>
        </ul>
        <p>
          All three are data processors acting under our instruction. We have not engaged any
          other processors for the purpose of running this shop.
        </p>

        <h2>How long we keep your data</h2>
        <p>
          Order records (name, address, email, order contents, and payment reference) are
          retained for <strong>seven years</strong> from the date of purchase. This is
          required by Dutch tax law (Art. 52 AWR — Algemene wet inzake rijksbelastingen).
          After that period, records are deleted.
        </p>
        <p>
          Postcard message content is deleted once the card has been mailed.
        </p>

        <h2>Your rights under GDPR</h2>
        <p>
          As a data subject under the General Data Protection Regulation, you have the right
          to:
        </p>
        <ul>
          <li>
            <strong>Access</strong> — request a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Rectification</strong> — ask us to correct inaccurate or incomplete data.
          </li>
          <li>
            <strong>Erasure</strong> — ask us to delete your data, where we are not legally
            required to retain it (e.g. tax records must be kept for seven years).
          </li>
          <li>
            <strong>Portability</strong> — receive your data in a structured, commonly used
            format.
          </li>
          <li>
            <strong>Objection</strong> — object to processing where we rely on legitimate
            interest as our legal basis (we currently do not, but this right exists).
          </li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>.
          We will respond within one month.
        </p>

        <h2>Complaints</h2>
        <p>
          If you believe we have handled your data unlawfully, you have the right to lodge a
          complaint with the Dutch data protection authority, the{" "}
          <strong>Autoriteit Persoonsgegevens (AP)</strong>, at autoriteitpersoonsgegevens.nl.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          This website does not currently use cookies for advertising or tracking. If
          analytics are introduced in future, this policy will be updated and appropriate
          consent mechanisms will be put in place.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The date at the top of the page
          reflects the most recent revision. Material changes will be communicated by email
          to customers with open orders at the time of the change.
        </p>

      </div>
    </div>
  );
}
