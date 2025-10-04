import { LegalPage } from "@/components/LegalPage";
import { getContentBySlug } from "@/lib/content";

export const metadata = {
  title: "Privacy Policy | Becoming Diamond",
  description: "Privacy policy for Becoming Diamond - how we collect, use, and protect your data",
};

export default async function PrivacyPage() {
  const content = await getContentBySlug("legal", "privacy-policy");

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
