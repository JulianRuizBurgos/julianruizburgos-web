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
    <>
      {/* Dark header */}
      <section className="bg-navy-700 pt-20 pb-20 px-6 lg:px-20">
        <div className="max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-navy-200">IT Consulting</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Freelance.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-200 md:text-lg">
            Software development and IT consulting — ERP implementation, bespoke web
            applications, infrastructure, and technical advisory. I work with small organisations
            and teams that need thoughtful, reliable engineering.
          </p>
        </div>
      </section>

    <div className="mx-auto max-w-6xl px-6">

      <div className="space-y-20 py-16">
        {/* Services */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-earth-900">What I do</h2>
          <p className="mt-1 text-sm text-earth-400">Services available for hire</p>
          <div className="mt-10 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="border-t-2 border-navy-400 pt-7">
                <h3 className="font-serif text-xl font-semibold text-navy-700">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">
                  {service.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.areas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-600"
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
          <p className="mt-1 text-sm text-earth-400">Selected client work</p>
          <div className="mt-10 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/it/${project.slug}`}
                className="group border-t-2 border-earth-300 pt-7 transition-opacity hover:opacity-75"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-earth-400">
                  {project.client}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold text-earth-900">
                  {project.tagline}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-earth-600">
                  {project.outcomeOneLiner}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest text-earth-400 transition-colors group-hover:text-terracotta-500">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
