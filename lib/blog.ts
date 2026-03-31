import fs from "fs/promises";
import type { Dirent } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked, Renderer } from "marked";
import markedFootnote from "marked-footnote";

export type Topic = "ecology" | "photography" | "technology" | "travel" | "personal";

export interface BlogPost {
  id: string;
  title: string;
  date: string;        // ISO date string (for sorting)
  displayDate: string; // formatted for display, e.g. "October 2025"
  topic: Topic;
  readTime: string;
  excerpt: string;
  content: string;     // rendered HTML
  tags: string[];
}

marked.use(markedFootnote());

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const VALID_TOPICS = new Set<Topic>(["ecology", "photography", "technology", "travel", "personal"]);

function toValidTopic(raw: unknown): Topic {
  if (typeof raw === "string" && VALID_TOPICS.has(raw as Topic)) return raw as Topic;
  return "personal";
}

function calcReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function stripObsidianSyntax(markdown: string): string {
  return markdown
    // Strip lines that are a heading prefix + Obsidian embed: # ![[...]]
    .replace(/^#+\s*!\[\[[^\]]*\]\]\s*$/gm, "")
    // Strip inline Obsidian embeds: ![[...]]
    .replace(/!\[\[[^\]]*\]\]/g, "")
    // Convert Obsidian wikilinks [[text]] to plain text
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1");
}

// Rewrite relative image src values to the asset serving route
function makeRenderer(slug: string): Renderer {
  const renderer = new Renderer();
  renderer.image = ({ href, text, title }) => {
    const src =
      href && !href.startsWith("http") && !href.startsWith("/")
        ? `/blog/assets/${slug}/${href}`
        : href;
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${src}" alt="${text}"${titleAttr} class="rounded-sm my-6 max-w-full" />`;
  };
  return renderer;
}

async function readPost(slug: string): Promise<BlogPost> {
  const indexPath = path.join(BLOG_DIR, slug, "index.md");
  const raw = await fs.readFile(indexPath, "utf-8");
  const { data, content: body } = matter(raw);

  const cleaned = stripObsidianSyntax(body);
  const htmlContent = await marked(cleaned, { renderer: makeRenderer(slug) });

  const isoDate = typeof data.date === "string" ? data.date : "";

  return {
    id: slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: isoDate,
    displayDate: formatDate(isoDate),
    topic: toValidTopic(data.topic),
    readTime: calcReadTime(body),
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    content: htmlContent,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  // Only directories, skip those starting with _
  const slugs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name);

  const results = await Promise.allSettled(slugs.map(readPost));

  const posts = results
    .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === "fulfilled")
    .map((r) => r.value);

  return posts.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (isNaN(da) || isNaN(db)) return 0;
    return db - da;
  });
}

export async function getTopicCounts(): Promise<{ topic: Topic; count: number }[]> {
  const posts = await getAllPosts();
  const counts: Partial<Record<Topic, number>> = {};
  posts.forEach((p) => {
    counts[p.topic] = (counts[p.topic] ?? 0) + 1;
  });
  return Object.entries(counts).map(([topic, count]) => ({
    topic: topic as Topic,
    count: count as number,
  }));
}
