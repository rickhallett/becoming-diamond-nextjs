import { LegalPage } from "@/components/LegalPage";
import { getContentBySlug } from "@/lib/content";

export const metadata = {
  title: "Terms of Service | Becoming Diamond",
  description: "Terms of Service for Becoming Diamond programs and services",
};

export default async function TermsPage() {
  const content = await getContentBySlug("legal", "terms-of-service");

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
