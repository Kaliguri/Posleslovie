import { legalDocuments, type LegalDocumentSlug } from "@/shared/config/legal-documents";

export function LegalDocumentModal({ slug }: Readonly<{ slug: LegalDocumentSlug }>) {
  const document = legalDocuments.find((item) => item.slug === slug);

  if (!document) {
    return null;
  }

  return (
    <article className="max-w-[760px]">
      <div className="space-y-4 text-sm leading-[1.7] text-[#0f172a] lg:text-base">
        {document.content.map((paragraph, index) => (
          <p key={`${document.slug}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
