import React, { useState } from "react";
import classNames from "../../utils/classNames";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  className = "",
  showToggle = false,
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showToggle && visible ? "text" : type;

  return (
    <div className={classNames("flex flex-col space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}{required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={classNames(
            "w-full px-4 py-2.5 rounded-lg bg-glass border border-glassBorder text-slate-900 placeholder-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50",
            error && "border-rose-500 focus:ring-rose-500/20",
            "transition-all duration-200"
          )}
          {...rest}
        />
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
