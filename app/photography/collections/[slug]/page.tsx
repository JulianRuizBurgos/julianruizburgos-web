import { getCollection, getAllCollections } from "@/lib/photography";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionView from "@/components/CollectionView";

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCollection(slug);
  if (!result) return {};
  return {
    title: `${result.collection.title} — Photography — Julian Ruiz Burgos`,
    description: result.collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCollection(slug);
  if (!result) notFound();
  return <CollectionView collection={result.collection} photos={result.photos} />;
}
