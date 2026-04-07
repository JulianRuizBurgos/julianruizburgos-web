import Image from "next/image";
import type { Metadata } from "next";
import CompanyLogo from "@/public/ruiz_burgos_ecology_and_software_logo_rgb.svg"
export const metadata: Metadata = {
  title: "Contact — Julian Ruiz Burgos",
  description: "Get in touch about print orders, IT consulting, or ecology work.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-28 pb-20">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-earth-400">Contact</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-earth-900">Get in touch</h1>
      <div className="mt-2 h-0.5 w-12 bg-terracotta-400" />

      <div className="prose-content mt-10 space-y-10">

        <section>
          <h2>Print shop enquiries</h2>
          <p>
            For questions about orders, print sizes, paper types, or shipping, email{" "}
            <a href="mailto:printshop@julianruizburgos.net">printshop@julianruizburgos.net</a>.
          </p>
          <p>
            I aim to respond within one business day. For urgent order queries — for example if you
            need a print by a specific date — please mention that in your message.
          </p>
        </section>

        <section>
          <h2>IT consulting</h2>
          <p>
            For freelance software development and IT consulting enquiries, use address:{" "}
            <a href="mailto:contact@julianruizburgos.net">contact@julianruizburgos.net</a>.
          </p>
        </section>

        <section>
          <h2>Business details</h2>
          <div className="flex items-start gap-6">
            <Image
              src={CompanyLogo}
              alt="Ruiz Burgos Ecology and Software"
              width={200}
              height={200}
              className="shrink-0 self-stretch object-contain"
            />
            <div>
              <p>
                Ruiz Burgos Ecology and Software<br />
                Steversemolen 48<br />
                5612 DV Eindhoven<br />
                Netherlands
              </p>
              <p>
                KvK (Chamber of Commerce): 98713698<br />
                BTW (VAT) number: NL005348430B65
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
