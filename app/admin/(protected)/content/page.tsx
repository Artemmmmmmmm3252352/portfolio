import { ContentForm } from "@/components/admin/content-form";
import { getAdminSiteContent } from "@/lib/data";

export default async function AdminContentPage() {
  const content = await getAdminSiteContent();

  return (
    <div>
      <h1 className="section-title">Site Content</h1>
      <ContentForm content={content} />
    </div>
  );
}
