import { cloneElement, isValidElement, useId } from "react";

/**
 * Field wraps a single form control with label + hint + error.
 * Automatically wires aria-describedby and aria-invalid onto the child input.
 *
 * Usage:
 *   <Field label="Phone" hint="Include country code" error={err}>
 *     <Input name="phone" value={v} onChange={...} />
 *   </Field>
 */
export default function Field({
  label,
  hint,
  error,
  required = false,
  children,
  id,
}) {
  const auto = useId();
  const fieldId = id || `field-${auto}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  let child = children;
  if (isValidElement(children)) {
    child = cloneElement(children, {
      id: fieldId,
      invalid: Boolean(error) || children.props.invalid,
      describedBy,
    });
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-semibold text-plu-black"
      >
        {label}
        {required && (
          <span aria-hidden className="text-plu-red ml-1">*</span>
        )}
      </label>

      {child}

      {hint && !error && (
        <p id={hintId} className="text-xs text-plu-slate">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
