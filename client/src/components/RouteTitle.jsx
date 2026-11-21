import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES = {
  "/": "Home",
  "/login": "Sign in",
  "/register": "Join PLU",
  "/dashboard": "My Dashboard",
  "/verify": "Verify a membership",
  "/officers": "Patriotic Officers",
  "/endorse": "Public Endorsement",
  "/assist/register": "Help someone register",
  "/assist/activity": "My assistance",
  "/forgot-pin": "Forgot PIN",
  "/reset-pin": "Reset PIN",
  "/review": "Review queue",
  "/corruption/report": "Report Corruption",
  "/corruption/track": "Track a Report",
  "/corruption/list": "Corruption reports",
  "/reporting": "Reporting dashboard",
  "/events": "Events",
  "/events/new": "Create event",
  "/legal/about": "About",
  "/legal/faq": "FAQ",
  "/legal/privacy": "Privacy Policy",
  "/legal/terms": "Terms of Service",
};

function titleFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/review/")) return "Review detail";
  if (pathname.startsWith("/corruption/")) return "Corruption report";
  if (pathname.startsWith("/events/")) return "Event";
  if (pathname.startsWith("/legal/")) return "Legal";
  return "PLU Mobi";
}

export default function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const name = titleFor(pathname);
    document.title = `${name} · PLU Mobi`;
    // WCAG 2.4.3: move focus to main landmark on route change
    const main = document.getElementById("main-content");
    if (main) {
      main.focus({ preventScroll: false });
    }
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
