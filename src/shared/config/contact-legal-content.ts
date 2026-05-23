import { legalDocuments, type LegalDocumentSlug } from "./legal-documents";
import { siteConfig } from "./site";

export type SiteSettingsContent = {
  phone: string;
  email: string;
  socials: Array<{
    label: string;
    href: string;
  }>;
};

export type LegalDocumentContent = {
  slug: LegalDocumentSlug;
  pdfPath: string;
  title: string;
  shortTitle: string;
  content: string[];
};

export const defaultSiteSettingsContent: SiteSettingsContent = {
  phone: siteConfig.phone,
  email: siteConfig.email,
  socials: siteConfig.socials.map((social) => ({
    label: social.label,
    href: social.href,
  })),
};

export const defaultLegalDocumentsContent: LegalDocumentContent[] = legalDocuments.map((document) => ({
  slug: document.slug,
  pdfPath: document.pdfPath,
  title: document.title,
  shortTitle: document.shortTitle,
  content: [...document.content],
}));
