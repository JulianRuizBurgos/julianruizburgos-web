"use client";

import { useState, useEffect } from "react";
import { getAllPosts, getTopicCounts, type BlogPost, type Topic } from "@/lib/blog";

// ── topic accent colours ──────────────────────────────────────────────────────
const topicMeta: Record<Topic, { pill: string; dot: string; label: string }> = {
  ecology:     { pill: "bg-sage-100 text-sage-700",        dot: "bg-sage-500",        label: "Ecology"     },
  photography: { pill: "bg-amber-100 text-amber-800",      dot: "bg-amber-500",       label: "Photography" },
  technology:  { pill: "bg-plum-100 text-plum-700",        dot: "bg-plum-500",        label: "Technology"  },
  travel:      { pill: "bg-earth-200 text-earth-700",      dot: "bg-earth-500",       label: "Travel"      },
  personal:    { pill: "bg-terracotta-100 text-terracotta-700", dot: "bg-terracotta-400", label: "Personal" },
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

// ── Article view (shared between mobile and desktop) ─────────────────────────
function ArticleView({
  post,
  contentKey,
  onBack,
}: {
  post: BlogPost;
  contentKey: number;
  onBack: () => void;
}) {
  return (
    <article
      key={contentKey}
      className="animate-blog-fadein mx-auto max-w-2xl px-6 py-10 md:px-10 md:py-14 lg:px-16"
    >
      <button
        onClick={onBack}
        className="mb-10 text-xs font-medium uppercase tracking-[0.2em] text-earth-400 transition-colors hover:text-earth-700"
      >
        ← All entries
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <TopicPill topic={post.topic} />
        <span className="text-xs text-earth-400">{post.date}</span>
        <span className="text-xs text-earth-300">·</span>
        <span className="text-xs text-earth-400">{post.readTime}</span>
      </div>

      <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight text-earth-900 md:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p className="mt-6 border-l-2 border-earth-300 pl-4 text-base font-medium italic leading-relaxed text-earth-600">
        {post.excerpt}
      </p>

      <div className="mt-8 space-y-5">
        {post.content.map((para, i) => (
          <p key={i} className="text-base leading-[1.85] text-earth-700">{para}</p>
        ))}
      </div>

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

// ── Post list card (shared) ───────────────────────────────────────────────────
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
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-earth-500">{post.excerpt}</p>
      <p className="mt-3 text-xs text-earth-400">{post.date}</p>
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const posts = getAllPosts();
  const topicCounts = getTopicCounts();

  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [filter, setFilter] = useState<Topic | null>(null);
  const [contentKey, setContentKey] = useState(0);

  const visible = filter ? posts.filter((p) => p.topic === filter) : posts;

  // If the selected post is filtered out, treat it as no selection
  const activeSelected = selected && (!filter || selected.topic === filter) ? selected : null;

  function selectPost(post: BlogPost) {
    setSelected(post);
    setContentKey((k) => k + 1);
  }

  function clearSelection() {
    setSelected(null);
  }

  function clearFilter() {
    setFilter(null);
  }

  // Scroll to top of page when article opens on mobile
  useEffect(() => {
    if (activeSelected) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSelected]);

  return (
    <>
      {/* ── Intro ───────────────────────────────────────────────────────────── */}
      {/* Hide intro on mobile when an article is open — article fills the screen */}
      <section className={`bg-earth-900 pt-28 pb-20 px-6 lg:px-20 ${activeSelected ? "hidden md:block" : "block"}`}>
        <div className="max-w-4xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-earth-500">Writing</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            Notebook.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-earth-300 md:text-lg">
            An unstructured space for things worth writing down. Observations from the field,
            notes on the craft of photography, thoughts on technology and the tools we build
            with it, and whatever sits at the edges of all three.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-earth-500">
            No fixed schedule. No theme beyond curiosity. Written when something demands to be written.
          </p>

          {/* Topic filters */}
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">
            <button
              onClick={clearFilter}
              className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                filter === null ? "text-white" : "text-earth-600 hover:text-earth-300"
              }`}
            >
              All
            </button>
            {topicCounts.map(({ topic, count }) => (
              <button
                key={topic}
                onClick={() => setFilter(filter === topic ? null : topic)}
                className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  filter === topic ? "text-terracotta-300" : "text-earth-600 hover:text-earth-300"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${topicMeta[topic].dot} opacity-70`} />
                {topicMeta[topic].label}
                <span className="text-earth-700">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE layout (< md) ────────────────────────────────────────────── */}
      <div className="md:hidden">
        {activeSelected ? (
          // Full-screen article view
          <div className="min-h-screen bg-earth-50 pt-16">
            <ArticleView post={activeSelected} contentKey={contentKey} onBack={clearSelection} />
          </div>
        ) : (
          // Scrollable post list
          <div className="bg-earth-50">
            {visible.length === 0 && (
              <p className="px-6 py-10 text-sm text-earth-400">No entries for this topic yet.</p>
            )}
            {visible.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                active={false}
                onClick={() => selectPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP layout (md+) — three-panel ──────────────────────────────── */}
      <div className="hidden md:flex md:sticky md:top-0 md:h-screen md:overflow-hidden border-t border-earth-800">

        {/* Left sidebar — post list */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-earth-200 bg-earth-50">
          {visible.length === 0 && (
            <p className="px-6 py-10 text-sm text-earth-400">No entries for this topic yet.</p>
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
        <main className="flex-1 overflow-y-auto bg-earth-50">
          {activeSelected ? (
            <ArticleView post={activeSelected} contentKey={contentKey} onBack={clearSelection} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-10 text-center">
              <p className="font-serif text-3xl font-semibold text-earth-200 leading-snug max-w-md">
                Select an entry to start reading.
              </p>
              <p className="mt-6 text-sm text-earth-400 max-w-xs leading-relaxed">
                {visible.length} {visible.length === 1 ? "entry" : "entries"}{" "}
                {filter ? `in ${topicMeta[filter].label}` : "across all topics"}.
              </p>
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="w-60 flex-shrink-0 overflow-y-auto border-l border-earth-200 bg-earth-50 px-6 py-8">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-earth-400">Topics</p>
          <div className="space-y-0">
            <button
              onClick={clearFilter}
              className={`flex w-full items-center justify-between border-t border-earth-100 py-3 text-left text-sm transition-colors first:border-0 ${
                filter === null ? "text-earth-900 font-medium" : "text-earth-500 hover:text-earth-800"
              }`}
            >
              <span>All</span>
              <span className="text-xs text-earth-400">{posts.length}</span>
            </button>
            {topicCounts.map(({ topic, count }) => (
              <button
                key={topic}
                onClick={() => setFilter(filter === topic ? null : topic)}
                className={`flex w-full items-center justify-between border-t border-earth-100 py-3 text-left text-sm transition-colors ${
                  filter === topic ? "text-terracotta-600 font-medium" : "text-earth-500 hover:text-earth-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${topicMeta[topic].dot}`} />
                  {topicMeta[topic].label}
                </span>
                <span className="text-xs text-earth-400">{count}</span>
              </button>
            ))}
          </div>

          {activeSelected && (
            <div className="mt-10 border-t border-earth-200 pt-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-earth-400">Reading</p>
              <p className="font-serif text-sm font-semibold leading-snug text-earth-800">{activeSelected.title}</p>
              <p className="mt-3 text-xs text-earth-500">{activeSelected.date}</p>
              <p className="mt-1 text-xs text-earth-500">{activeSelected.readTime}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {activeSelected.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-earth-100 px-2 py-0.5 text-xs text-earth-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 border-t border-earth-200 pt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-earth-400">About</p>
            <p className="text-xs leading-relaxed text-earth-500">
              Written by Julian Ruiz Burgos — ecologist, IT consultant, and photographer based in the UK.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
