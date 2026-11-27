/**
 * Avatar - shows member photo, gracefully falls back to initials.
 * WCAG 2.2: always provides alt text.
 */
import { useState } from "react";

const SIZE_CLASS = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-xl",
  xl: "w-32 h-32 text-3xl",
};

export default function Avatar({ src, name = "", size = "md", className = "", ring = false }) {
  const [err, setErr] = useState(false);
  const initials = (name || "").split(/\s+/).filter(Boolean).slice(0, 2).map(function(w){ return (w[0]||"").toUpperCase(); }).join("") || "?";
  const showImage = src && !err;
  const sizeCls = SIZE_CLASS[size] || SIZE_CLASS.md;
  return (
    <span
      role="img"
      aria-label={name ? name + " photo" : "Member photo"}
      className={"inline-flex items-center justify-center rounded-full overflow-hidden flex-none bg-plu-black text-plu-yellow font-bold " + sizeCls + (ring ? " ring-2 ring-plu-yellow" : "") + " " + className}
    >
      {showImage ? (
        <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" onError={function(){ setErr(true); }} />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </span>
  );
}
