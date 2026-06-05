import type { LegalDocumentSlug } from "@/shared/config/legal-documents";

/**
 * Typed contract for the global "open modal" event bus.
 *
 * The site header (and other widgets) emit a request to open a modal, and the
 * page-level controller subscribes to it. Using a shared, typed helper keeps the
 * event name and payload in one place instead of relying on stringly-typed
 * `CustomEvent` casts scattered across files.
 */
export type OpenModalType = "partners" | "contacts" | "checkout" | LegalDocumentSlug;

const MODAL_EVENT = "posleslovie:open-modal";

export function emitOpenModal(type: OpenModalType) {
  window.dispatchEvent(new CustomEvent<OpenModalType>(MODAL_EVENT, { detail: type }));
}

export function subscribeOpenModal(handler: (type: OpenModalType) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<OpenModalType>).detail);
  };

  window.addEventListener(MODAL_EVENT, listener);
  return () => window.removeEventListener(MODAL_EVENT, listener);
}
