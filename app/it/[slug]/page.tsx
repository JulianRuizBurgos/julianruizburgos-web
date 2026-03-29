import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getAllProjects } from "@/lib/it";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.tagline} — Julian Ruiz Burgos`,
    description: project.outcomeOneLiner,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Header */}
      <div className="pt-28 pb-16 border-b border-earth-200">
        <Link
          href="/it"
          className="mb-8 inline-block text-xs font-medium uppercase tracking-widest text-earth-400 transition-colors hover:text-terracotta-500"
        >
          ← IT Consulting
        </Link>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-earth-400">
          {project.client} — {project.clientDescription}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-earth-900 md:text-4xl">
          {project.tagline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-earth-600">
          {project.outcomeOneLiner}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-plum-100 px-2.5 py-0.5 text-xs font-medium text-plum-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-16 py-16">
        {/* Challenge & Solution */}
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
          <section className="border-t-2 border-earth-300 pt-7">
            <h2 className="font-serif text-xl font-semibold text-earth-900">The challenge</h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-600">{project.challenge}</p>
          </section>
          <section className="border-t-2 border-plum-400 pt-7">
            <h2 className="font-serif text-xl font-semibold text-earth-900">The solution</h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-600">{project.solution}</p>
          </section>
        </div>

        {/* Outcomes */}
        <section className="border-t-2 border-terracotta-400 pt-7">
          <h2 className="font-serif text-2xl font-semibold text-earth-900">Outcomes</h2>
          <ul className="mt-6 space-y-3">
            {project.outcomes.map((outcome, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-earth-600">
                <span className="mt-0.5 shrink-0 text-terracotta-400">✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section className="border-t-2 border-earth-200 pt-7">
          <h2 className="font-serif text-2xl font-semibold text-earth-900">Stack</h2>
          <p className="mt-3 text-sm leading-relaxed text-earth-600">{project.stack}</p>
        </section>

        {/* Technical details */}
        <section className="border-t-2 border-earth-200 pt-7">
          <h2 className="font-serif text-2xl font-semibold text-earth-900">Technical details</h2>
          <div className="mt-8 space-y-8">
            {project.technicalDetails.map((section) => (
              <div key={section.label}>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-plum-500">
                  {section.label}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="rounded-md border border-earth-100 bg-earth-50 px-4 py-2 font-mono text-xs text-earth-700"
                      dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, "<code>$1</code>") }}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="border-t border-earth-100 pt-8">
          <Link
            href="/it"
            className="text-xs font-medium uppercase tracking-widest text-earth-400 transition-colors hover:text-terracotta-500"
          >
            ← Back to IT Consulting
          </Link>
        </div>
      </div>
    </div>
  );
}
