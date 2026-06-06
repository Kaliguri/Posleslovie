// Lightweight payload guards for the AmoCRM worker.
//
// These do NOT prevent a determined client from tampering with amounts: the worker has no
// authoritative price catalogue (the CMS is the source of truth, read by the static site at
// build time), and no payment is taken here — the order becomes a CRM lead confirmed by a
// manager over the phone. The goal is only to reject malformed/garbage payloads and to flag
// amounts that are internally inconsistent with the unit price the site reported.

function isPositiveFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

export function validateCheckoutPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Invalid checkout payload";
  }

  if (!payload.formValues || typeof payload.formValues !== "object") {
    return "Invalid checkout payload: missing formValues";
  }

  if (!isPositiveInteger(payload.quantity)) {
    return "Invalid checkout payload: quantity must be a positive integer";
  }

  if (!isPositiveFiniteNumber(payload.total)) {
    return "Invalid checkout payload: total must be a positive number";
  }

  // Consistency check: when the site reports a unit price, the total should match it.
  // Allow a 1-rouble rounding tolerance.
  if (isPositiveFiniteNumber(payload.unitPrice)) {
    const expectedTotal = payload.unitPrice * payload.quantity;
    if (Math.abs(expectedTotal - payload.total) > 1) {
      return `Invalid checkout payload: total ${payload.total} does not match ${payload.quantity} x ${payload.unitPrice}`;
    }
  }

  return null;
}

export function validateLeadPayload(payload) {
  const formValues = payload?.formValues;
  if (!formValues || !formValues.name || !formValues.phone || !formValues.email) {
    return "Invalid lead payload";
  }
  return null;
}
