import React from "react";
import clsx from "clsx";

/**
 * Accessible text input with label and error.
 */
export default function TextInput({ id, label, error, type="text", register, required, placeholder, ...rest }) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div className="form-row">
      <label htmlFor={id}>{label}{required ? " *" : ""}</label>
      <input
        id={id}
        type={type}
        className={clsx("input", { "input-error": error })}
        aria-invalid={!!error}
        aria-describedby={errId}
        placeholder={placeholder}
        {...(register || {})}
        {...rest}
      />
      {error && <div id={errId} className="alert danger" role="alert">{error.message || String(error)}</div>}
    </div>
  );
}
