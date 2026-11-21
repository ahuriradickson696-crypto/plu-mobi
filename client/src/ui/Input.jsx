import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { id, invalid = false, describedBy, className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy || undefined}
      className={
        "w-full min-h-[44px] px-3 py-2 rounded-xl bg-white text-plu-black " +
        "border border-plu-black/15 placeholder:text-plu-slate/70 " +
        "focus:outline-none focus-visible:ring-4 " +
        (invalid
          ? "border-red-400 focus-visible:ring-red-300/60 "
          : "focus-visible:ring-plu-yellow/60 ") +
        className
      }
      {...rest}
    />
  );
});

export default Input;
