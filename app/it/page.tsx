import Link from "next/link";
import type { Metadata } from "next";
import { getAllServices, getAllProjects } from "@/lib/it";

export const metadata: Metadata = {
  title: "IT Consulting — Julian Ruiz Burgos",
  description:
    "Freelance software development and IT consulting. ERP implementation, web applications, infrastructure, and technical advisory.",
};

export default function ITPage() {
  const services = getAllServices();
  const projects = getAllProjects();

  return (
    <div>
      {/* Page header */}
      <div className="border-b border-plum-200 bg-plum-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-plum-500">
            Freelance
          </p>
          <h1 className="font-serif text-4xl font-semibold text-plum-700 md:text-5xl">
            IT Consulting
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-earth-700">
            Freelance software development and IT consulting — ERP implementation, bespoke web
            applications, infrastructure, and technical advisory. I work with small organisations
            and teams that need thoughtful, reliable engineering.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-20 px-6 py-16">
        {/* Services */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">What I do</h2>
          <p className="mt-1 text-sm text-earth-500">Services available for hire</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-lg border border-plum-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold text-plum-700">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-600">
                  {service.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.areas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full bg-plum-100 px-3 py-1 text-xs font-medium text-plum-600"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">Projects</h2>
          <p className="mt-1 text-sm text-earth-500">Selected client work</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/it/${project.slug}`}
                className="group rounded-lg border border-earth-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-plum-100 px-2.5 py-0.5 text-xs font-medium text-plum-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-earth-400">
                  {project.client}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-earth-900">
                  {project.tagline}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">
                  {project.outcomeOneLiner}
                </p>
                <span className="mt-4 inline-block text-xs font-medium text-plum-500 transition-colors group-hover:text-plum-700">
                  Read case study →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
