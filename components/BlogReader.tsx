"use client";

import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { BlogPost, Topic } from "@/lib/blog";

// ── topic accent colours ──────────────────────────────────────────────────────
const topicMeta: Record<Topic, { pill: string; dot: string; label: string }> = {
  ecology:     { pill: "bg-olive-100 text-olive-700",             dot: "bg-olive-500",        label: "Ecology"     },
  photography: { pill: "bg-amber-100 text-amber-800",           dot: "bg-amber-500",       label: "Photography" },
  technology:  { pill: "bg-navy-100 text-navy-700",             dot: "bg-navy-500",        label: "Technology"  },
  travel:      { pill: "bg-earth-200 text-earth-700",           dot: "bg-earth-500",       label: "Travel"      },
  personal:    { pill: "bg-terracotta-100 text-terracotta-700", dot: "bg-terracotta-400",  label: "Personal"    },
};

function TopicPill({ topic }: { topic: Topic }) {
  const m = topicMeta[topic];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${m.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ── Article view ──────────────────────────────────────────────────────────────
function ArticleView({
  post,
  contentKey,
  onBack,
  scrollContainer,
}: {
  post: BlogPost;
  contentKey: number;
  onBack: () => void;
  scrollContainer?: RefObject<HTMLElement | null>;
}) {
  // Scroll container to top when a new post loads
  useEffect(() => {
    scrollContainer?.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [contentKey, scrollContainer]);

  // Fix anchor links (footnotes etc.) to scroll within the container.
  // Native browser anchor navigation targets the window, not a nested
  // overflow-y-auto element, so we intercept and handle it ourselves.
  useEffect(() => {
    const container = scrollContainer?.current;
    if (!container) return;

    // Query AFTER content has rendered (useEffect runs post-paint)
    const links = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );

    const handlers = links.map((link) => {
      const handler = (e: MouseEvent) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (!href) return;
        const target = container.querySelector<HTMLElement>(href);
        if (!target) return;
        const top =
          container.scrollTop +
          target.getBoundingClientRect().top -
          container.getBoundingClientRect().top;
        container.scrollTo({ top, behavior: "smooth" });
      };
      link.addEventListener("click", handler);
      return { link, handler };
    });

    return () =>
      handlers.forEach(({ link, handler }) =>
        link.removeEventListener("click", handler)
      );
  }, [contentKey, scrollContainer]);

  return (
    <article
      key={contentKey}
      className="animate-blog-fadein px-16 py-10 md:px-24 md:py-14"
    >
      <button
        onClick={onBack}
        className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-earth-400 transition-colors hover:text-earth-700"
      >
        ← All entries
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <TopicPill topic={post.topic} />
        <span className="text-xs text-earth-400">{post.displayDate}</span>
        <span className="text-xs text-earth-300">·</span>
        <span className="text-xs text-earth-400">{post.readTime}</span>
      </div>

      <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-earth-900 md:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="mt-6 border-l-2 border-earth-300 pl-4 text-base font-medium italic leading-relaxed text-earth-600">
        {post.excerpt}
      </p>

      {/* Markdown body */}
      {post.content && (
        <div
          className="prose-content mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Embedded PDF (if post includes one) */}
      {post.pdf && (
        <div className="mt-8">
          <iframe
            src={post.pdf}
            title={post.title}
            className="w-full rounded border border-earth-200"
            style={{ height: "80vh" }}
          />
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-2 border-t border-earth-200 pt-6">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-earth-100 px-3 py-1 text-xs font-medium text-earth-600">
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// ── Post list card ────────────────────────────────────────────────────────────
function PostCard({
  post,
  active,
  onClick,
}: {
  post: BlogPost;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full border-b border-earth-100 px-6 py-5 text-left transition-colors ${
        active ? "bg-earth-100" : "hover:bg-earth-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <TopicPill topic={post.topic} />
        <span className="text-xs text-earth-400">{post.readTime}</span>
      </div>
      <h3 className={`mt-3 font-serif text-base font-semibold leading-snug transition-colors ${
        active ? "text-earth-900" : "text-earth-800 group-hover:text-earth-900"
      }`}>
        {post.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-earth-600">{post.excerpt}</p>
      <p className="mt-3 text-xs text-terracotta-800">{post.displayDate}</p>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full font-semibold bg-earth-100 px-2 py-0.5 text-xs text-earth-500">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogReader({
  posts,
  topicCounts,
}: {
  posts: BlogPost[];
  topicCounts: { topic: Topic; count: number }[];
}) {
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [topicFilter, setTopicFilter] = useState<Topic | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  // Collect all unique tags across all posts, sorted
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags))
  ).sort();

  const visible = posts.filter((p) => {
    if (topicFilter && p.topic !== topicFilter) return false;
    if (tagFilter && !p.tags.includes(tagFilter)) return false;
    return true;
  });

  const activeSelected =
    selected && visible.some((p) => p.id === selected.id) ? selected : null;

  function selectPost(post: BlogPost) {
    setSelected(post);
    setContentKey((k) => k + 1);
  }

  function clearSelection() {
    setSelected(null);
  }

  function clearFilters() {
    setTopicFilter(null);
    setTagFilter(null);
  }

  // Scroll window to top on mobile when article opens (desktop handled inside ArticleView)
  useEffect(() => {
    if (activeSelected) window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeSelected]);

  return (
    <>
      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <section className={`relative pt-20 pb-20 px-6 lg:px-20 overflow-hidden ${activeSelected ? "hidden md:block" : "block"}`}
        style={{ backgroundImage: "url(/images/blog-page-header-background.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-earth-300">Writing</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Notebook.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-earth-300 md:text-lg">
            An unstructured space for things worth writing down. Observations from the field,
            notes on the craft of photography, thoughts on technology and the tools we build
            with it, and whatever sits at the edges of all three.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-earth-400">
            No fixed schedule. No theme beyond curiosity. Written when something demands to be written.
          </p>

          {/* Topic filters */}
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
            <button
              onClick={clearFilters}
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                topicFilter === null && tagFilter === null ? "text-white" : "text-earth-600 hover:text-earth-300"
              }`}
            >
              All
            </button>
            {topicCounts.map(({ topic, count }) => (
              <button
                key={topic}
                onClick={() => { setTopicFilter(topicFilter === topic ? null : topic); setTagFilter(null); }}
                className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  topicFilter === topic ? "text-terracotta-300" : "text-earth-300 hover:text-earth-300"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${topicMeta[topic].dot} opacity-70`} />
                {topicMeta[topic].label}
                <span className="text-earth-200">({count})</span>
              </button>
            ))}
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                    tagFilter === tag
                      ? "border-terracotta-400 bg-terracotta-400/10 text-terracotta-300"
                      : "border-earth-400 text-earth-200 hover:border-earth-500 hover:text-earth-400"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MOBILE layout (< md) ──────────────────────────────────────────── */}
      <div className="md:hidden">
        {activeSelected ? (
          <div className="min-h-screen bg-earth-50 pt-16">
            <ArticleView post={activeSelected} contentKey={contentKey} onBack={clearSelection} />
          </div>
        ) : (
          <div className="bg-earth-50">
            {visible.length === 0 && (
              <p className="px-6 py-10 text-sm text-earth-400">No entries for this filter.</p>
            )}
            {visible.map((post) => (
              <PostCard key={post.id} post={post} active={false} onClick={() => selectPost(post)} />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP layout (md+) — three-panel ───────────────────────────── */}
      <div className="hidden md:flex md:sticky md:top-0 md:h-screen md:overflow-hidden border-t border-earth-800">

        {/* Left sidebar — post list */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-earth-200 bg-earth-50">
          {visible.length === 0 && (
            <p className="px-6 py-10 text-sm text-earth-400">No entries for this filter.</p>
          )}
          {visible.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              active={activeSelected?.id === post.id}
              onClick={() => selectPost(post)}
            />
          ))}
        </aside>

        {/* Center — reading area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-earth-50">
          {activeSelected ? (
            <ArticleView post={activeSelected} contentKey={contentKey} onBack={clearSelection} scrollContainer={mainRef} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-10 text-center">
              <p className="font-serif text-3xl font-semibold text-earth-400 leading-snug max-w-md">
                Select an entry to start reading.
              </p>
              <p className="mt-6 text-sm text-earth-600 max-w-xs leading-relaxed">
                {visible.length} {visible.length === 1 ? "entry" : "entries"}{" "}
                {topicFilter
                  ? `in ${topicMeta[topicFilter].label}`
                  : tagFilter
                  ? `tagged #${tagFilter}`
                  : "across all topics"}.
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar — topics, tags, reading info */}
        <aside className="w-60 flex-shrink-0 overflow-y-auto border-l border-earth-200 bg-earth-50 px-6 py-8">
          <p className="mb-5 text-xs font-medium font-semibold uppercase tracking-[0.2em] text-earth-600">Topics</p>
          <div className="space-y-0">
            <button
              onClick={clearFilters}
              className={`flex w-full items-center justify-between border-t border-earth-100 py-3 text-left text-sm transition-colors first:border-0 ${
                topicFilter === null && tagFilter === null ? "text-earth-900 font-medium" : "text-earth-600 hover:text-earth-800"
              }`}
            >
              <span>All</span>
              <span className="text-xs text-terracotta-600">{posts.length}</span>
            </button>
            {topicCounts.map(({ topic, count }) => (
              <button
                key={topic}
                onClick={() => { setTopicFilter(topicFilter === topic ? null : topic); setTagFilter(null); }}
                className={`flex w-full items-center justify-between border-t border-earth-100 py-3 text-left text-sm transition-colors ${
                  topicFilter === topic ? "text-terracotta-600 font-medium" : "text-earth-600 hover:text-earth-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${topicMeta[topic].dot}`} />
                  {topicMeta[topic].label}
                </span>
                <span className="text-xs text-terracotta-600">{count}</span>
              </button>
            ))}
          </div>

          {/* Tag list */}
          {allTags.length > 0 && (
            <div className="mt-8 border-t border-earth-200 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-earth-600">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={`rounded-full border px-2 py-0.5 text-xs transition-colors font-semibold ${
                      tagFilter === tag
                        ? "border-terracotta-400 bg-terracotta-400/10 text-terracotta-600"
                        : "border-earth-200 text-earth-400 hover:border-earth-400 hover:text-earth-600"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSelected && (
            <div className="mt-8 border-t border-earth-200 pt-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-earth-400">Reading</p>
              <p className="font-serif text-sm font-semibold leading-snug text-earth-900">{activeSelected.title}</p>
              <p className="mt-3 text-xs text-earth-600">{activeSelected.displayDate}</p>
              <p className="mt-1 text-xs text-earth-600">{activeSelected.readTime}</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
