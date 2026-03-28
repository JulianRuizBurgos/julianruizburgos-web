export interface Service {
  title: string;
  description: string;
  areas: string[];
}

export interface TechnicalSection {
  label: string;
  items: string[];
}

export interface Project {
  slug: string;
  client: string;
  clientDescription: string;
  tagline: string;
  outcomeOneLiner: string;
  tags: string[];
  challenge: string;
  solution: string;
  outcomes: string[];
  stack: string;
  technicalDetails: TechnicalSection[];
}

export const services: Service[] = [
  {
    title: "ERP & Business Software",
    description:
      "Implementation, customisation, and deployment of ERP platforms — including Odoo — tailored to your organisation's workflows and constraints.",
    areas: ["Odoo Enterprise", "Custom modules", "PaaS deployment", "Workflow automation"],
  },
  {
    title: "Web & Application Development",
    description:
      "Bespoke web applications and internal tools built with modern frameworks. From data dashboards to public-facing products.",
    areas: ["Next.js / React", "TypeScript", "REST & GraphQL APIs", "Database design"],
  },
  {
    title: "Infrastructure & Deployment",
    description:
      "Server setup, containerisation, and automated deployment pipelines. Getting software reliably from development into production.",
    areas: ["Docker & Compose", "Linux / VPS", "CI/CD pipelines", "Monitoring"],
  },
  {
    title: "Technical Consulting",
    description:
      "Architecture reviews, technology choices, and automation strategy. Practical advice grounded in hands-on engineering experience.",
    areas: ["System design", "Tech stack selection", "Process automation", "Code review"],
  },
];

export const projects: Project[] = [
  {
    slug: "gl-ecologie",
    client: "GL-Ecologie",
    clientDescription:
      "an ecological consulting organisation specialising in nature and wildlife research, based in the Netherlands",
    tagline: "Odoo 19 Enterprise implementation on Odoo.sh",
    outcomeOneLiner:
      "Centralised field planning, project tracking, and equipment inventory for a nature and wildlife research organisation",
    tags: ["Odoo 19", "Python", "OWL", "Odoo.sh", "XML", "SCSS"],
    challenge:
      "GL-Ecologie had no centralised system for managing field staff schedules, project assignments, or equipment. Planning happened across spreadsheets and ad-hoc messages, making it difficult to enforce protocol windows, track equipment availability, or give managers a real-time view of operations.",
    solution:
      "Odoo 19 Enterprise deployed on Odoo.sh (PaaS), with a custom module built on top of the Planning, Project, and HR apps. The module adds constraint-aware scheduling, protocol intelligence, an equipment inventory subsystem, and a bulk shift creation wizard — all integrated into Odoo's native UI.",
    outcomes: [
      "Employee shift scheduling with availability tracking and constraint enforcement — role matching, maximum shifts per week, morning/evening conflict detection, and weekend restrictions",
      "Shift-to-project linking with protocol-aware scheduling alerts — warns when a field visit falls outside its protocol window or violates minimum gap rules between related visits",
      "Inventory management for field equipment — material types, units, statuses, and consumables linked to individual shifts",
      "Automated shift reminders sent to assigned employees 24 hours before each shift",
      "Bulk shift creation wizard for managers — create or edit multiple shifts across resources in a single form",
      "Deployed to production on Odoo.sh with full CI integration",
    ],
    stack:
      "Odoo 19 Enterprise · Python (ORM extensions) · XML views · OWL (Odoo Web Library) · SCSS",
    technicalDetails: [
      {
        label: "Custom module",
        items: [
          "`gl_custom_module` — extends `planning`, `project`, `hr`, and `base`",
        ],
      },
      {
        label: "Models built / extended",
        items: [
          "`planning.slot` — extended with constraint engine fields and protocol window logic",
          "`planning.shift_type` — custom model for shift classification",
          "`planning.employee_availability` — backing model for the availability calendar",
          "`hr.employee` — extended with role, shift-type preference, and restriction fields",
          "`project.project` — extended with protocol window dates and visit gap configuration",
          "Materials subsystem — material types, units, categories, statuses, and consumables",
        ],
      },
      {
        label: "Constraint engine",
        items: [
          "Availability and role-match validation at scheduling time",
          "Maximum shifts per week cap, configurable per employee",
          "Shift type preference matching",
          "Morning / evening conflict detection",
          "Weekend restriction enforcement",
        ],
      },
      {
        label: "Protocol intelligence",
        items: [
          "Computed `date_outside_protocol_window` field on `planning.slot`",
          "Related-visit gap checker with dynamic warning messages surfaced in the form view",
        ],
      },
      {
        label: "OWL component",
        items: [
          "Employee availability calendar rendered inline in the scheduling form using Odoo Web Library",
        ],
      },
      {
        label: "Multi-assign wizard",
        items: [
          "Create or bulk-edit N shifts across multiple resources in a single form",
          "Constraint and domain logic reused via in-memory slot objects",
          "Entry points from the Planning menu, task form stat buttons, and list view selection bar",
        ],
      },
      {
        label: "Odoo Studio integration",
        items: [
          "Managed Studio-generated customisations alongside hand-written module code",
          "Enforced `noupdate=False` on all Studio view records to prevent upgrade conflicts",
        ],
      },
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllServices(): Service[] {
  return services;
}
