/**
 * Central network state helper.
 * Distinguishes real "offline" from "server unreachable".
 *
 * Usage:
 *   import { isOnline, classifyError } from "../../lib/net";
 *   if (!isOnline()) setError("You are offline...");
 *   else setError(classifyError(err));
 */

/** True if the browser reports a network connection */
export function isOnline() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

/**
 * Classify an axios/fetch error into a user-friendly message.
 *
 * Rules:
 *   - If browser says offline → "You are offline..."
 *   - If no HTTP response → "Cannot reach the server..."
 *   - If 4xx/5xx → use server-provided error, or generic fallback
 */
export function classifyError(err) {
  // 1. Genuinely offline?
  if (!isOnline()) {
    return "You are offline. Please reconnect and try again.";
  }

  // 2. No response at all (timeout, DNS, network unreachable)
  if (!err?.response) {
    const isTimeout =
      err?.code === "ECONNABORTED" ||
      err?.message?.includes("timeout") ||
      err?.message === "Network Error";

    if (isTimeout) {
      return "The server is taking too long to respond. It may be starting up — please wait 30–50 seconds and try again.";
    }
    return "Cannot reach the server. Please check your connection or try again in a moment.";
  }

  // 3. Server returned a status
  const status = err.response.status;
  const serverMsg = err.response.data?.error;

  if (status === 429) {
    return serverMsg || "Too many attempts. Please wait a minute and try again.";
  }
  if (status === 401) {
    return serverMsg || "Invalid credentials. Please check and try again.";
  }
  if (status === 403) {
    return serverMsg || "You do not have permission to do this.";
  }
  if (status === 404) {
    return serverMsg || "Not found.";
  }
  if (status >= 500) {
    return serverMsg || "The server had a problem. Please try again.";
  }

  return serverMsg || "Something went wrong. Please try again.";
}
