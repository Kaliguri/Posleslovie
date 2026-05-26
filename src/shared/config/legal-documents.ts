import legalDocumentsJson from "../../../content/legal-documents.json";

export const legalDocuments = legalDocumentsJson.documents;

export type LegalDocumentSlug =
  | "privacy"
  | "offer"
  | "personal-data-consent"
  | "personal-data-distribution"
  | "marketing-consent";
