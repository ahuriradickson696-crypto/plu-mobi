import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { id, invalid = false, describedBy, className = "", rows = 4, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy || undefined}
      className={
        "w-full px-3 py-2 rounded-xl bg-white text-plu-black " +
        "border border-plu-black/15 placeholder:text-plu-slate/70 " +
        "focus:outline-none focus-visible:ring-4 resize-y min-h-[96px] " +
        (invalid
          ? "border-red-400 focus-visible:ring-red-300/60 "
          : "focus-visible:ring-plu-yellow/60 ") +
        className
      }
      {...rest}
    />
  );
});

export default Textarea;
