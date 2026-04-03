import { getAllPhotos, getTagCounts } from "@/lib/photography";
import PhotographyGallery from "@/components/PhotographyGallery";

export default async function PhotographyPage() {
  const [photos, tagCounts] = await Promise.all([getAllPhotos(), getTagCounts()]);
  return <PhotographyGallery photos={photos} tagCounts={tagCounts} />;
}
