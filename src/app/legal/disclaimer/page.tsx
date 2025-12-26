import { LegalPage } from "@/components/LegalPage";
import { getContentBySlug } from "@/lib/content";

export const metadata = {
  title: "Disclaimer | Becoming Diamond",
  description: "Legal disclaimer for Becoming Diamond programs and services",
};

export default async function DisclaimerPage() {
  const content = await getContentBySlug("legal", "disclaimer");

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Content not found</p>
      </div>
    );
  }

  return (
    <LegalPage
      title={content.frontmatter.title as string}
      lastUpdated={content.frontmatter.lastUpdated as string}
      content={content.content}
    />
  );
}
