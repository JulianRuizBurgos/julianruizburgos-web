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
    <div>
      {/* Header */}
      <div className="border-b border-plum-200 bg-plum-100">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/it"
            className="mb-6 inline-block text-xs font-medium uppercase tracking-widest text-plum-500 transition-colors hover:text-plum-700"
          >
            ← IT Consulting
          </Link>
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-plum-200 px-2.5 py-0.5 text-xs font-medium text-plum-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-earth-500">
            {project.client} — {project.clientDescription}
          </p>
          <h1 className="font-serif text-3xl font-semibold text-plum-700 md:text-4xl">
            {project.tagline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-earth-700">
            {project.outcomeOneLiner}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
        {/* Challenge & Solution */}
        <div className="grid gap-10 sm:grid-cols-2">
          <section>
            <h2 className="font-serif text-xl font-semibold text-earth-900">
              The challenge
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-600">
              {project.challenge}
            </p>
          </section>
          <section>
            <h2 className="font-serif text-xl font-semibold text-earth-900">
              The solution
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-earth-600">
              {project.solution}
            </p>
          </section>
        </div>

        {/* Outcomes */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">
            Outcomes
          </h2>
          <ul className="mt-6 space-y-3">
            {project.outcomes.map((outcome, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-earth-600">
                <span className="mt-0.5 shrink-0 text-plum-400">✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">Stack</h2>
          <p className="mt-3 text-sm leading-relaxed text-earth-600">{project.stack}</p>
        </section>

        {/* Technical details */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">
            Technical details
          </h2>
          <div className="mt-6 space-y-8">
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
            className="text-sm font-medium text-plum-500 transition-colors hover:text-plum-700"
          >
            ← Back to IT Consulting
          </Link>
        </div>
      </div>
    </div>
  );
}
