import { getAllPosts, getTopicCounts } from "@/lib/blog";
import BlogReader from "@/components/BlogReader";

export default async function BlogPage() {
  const [posts, topicCounts] = await Promise.all([getAllPosts(), getTopicCounts()]);
  return <BlogReader posts={posts} topicCounts={topicCounts} />;
}
