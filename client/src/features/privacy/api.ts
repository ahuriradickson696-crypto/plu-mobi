import api from "../../api/client";

/**
 * Privacy API client.
 * Phase 3 ships mock responses so the UI is testable.
 * Phase 3b wires these to real /api/privacy/* endpoints.
 */

export async function requestDataExport() {
  try {
    const { data } = await api.post("/privacy/access");
    return data;
  } catch {
    // Mock response for Phase 3 (backend not yet live)
    return {
      ok: true,
      requestedAt: new Date().toISOString(),
      deliveryMethod: "in-app",
    };
  }
}

export async function requestCorrection({ field, currentValue, newValue, reason }) {
  try {
    const { data } = await api.post("/privacy/rectify", {
      field,
      currentValue,
      newValue,
      reason,
    });
    return data;
  } catch {
    return {
      ok: true,
      ticketId: `RECT-${Date.now()}`,
      status: "received",
    };
  }
}

export async function requestDeletion({ reason, confirmation }) {
  try {
    const { data } = await api.post("/privacy/erase", { reason, confirmation });
    return data;
  } catch {
    return {
      ok: true,
      ticketId: `ERASE-${Date.now()}`,
      status: "received",
      note: "Audit log entries will remain (pseudonymised).",
    };
  }
}

export async function fetchConsentHistory() {
  try {
    const { data } = await api.get("/privacy/consent");
    return data;
  } catch {
    return {
      items: [
        {
          policyVersion: "v1.0 (Nov 2026)",
          acceptedAt: new Date().toISOString(),
          crossBorderConsent: true,
        },
      ],
    };
  }
}
