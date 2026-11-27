import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/auth";
import api from "../../../api/client";

/**
 * RoleGate — fails closed.
 * Client flag is a hint only; server response is authoritative.
 * If the server does not confirm reviewer capability, the child never renders.
 */
export function RoleGate({ children }) {
  const nav = useNavigate();
  const { token, member } = useAuth();
  const [state, setState] = useState("checking"); // checking | allowed | denied

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
    api
      .get("/review/whoami")
      .then((r) => {
        if (r.data?.isReviewer) setState("allowed");
        else setState("denied");
      })
      .catch(() => {
        // Fail closed: any error means no access
        setState("denied");
      });
  }, [token, nav]);

  if (state === "checking") {
    return (
      <p role="status" aria-live="polite" className="text-center py-6 text-sm text-ink-secondary">
        Checking reviewer access…
      </p>
    );
  }
  if (state === "denied") {
    return (
      <div className="max-w-md mx-auto text-center py-10 space-y-3">
        <p className="text-sm text-ink-primary font-semibold">Reviewer access required</p>
        <p className="text-sm text-ink-secondary">
          Your account does not have reviewer capability. Contact the PLU Secretariat if you believe this is an error.
        </p>
      </div>
    );
  }
  return children;
}
