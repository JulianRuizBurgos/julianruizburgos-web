import { getAllPhotos, getTagCounts, getAllCollections } from "@/lib/photography";
import PhotographyGallery from "@/components/PhotographyGallery";

export default async function PhotographyPage() {
  const [photos, tagCounts, collections] = await Promise.all([
    getAllPhotos(),
    getTagCounts(),
    getAllCollections(),
  ]);
  return <PhotographyGallery photos={photos} tagCounts={tagCounts} collections={collections} />;
}
