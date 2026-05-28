"use client";

import { useState, type InputHTMLAttributes } from "react";

import { getRussianCitySuggestions } from "@/shared/lib/city";

export function FormField({
  label,
  placeholder,
  value,
  error,
  required = false,
  type = "text",
  autoComplete,
  inputMode,
  list,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  list?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label
      className={`grid min-h-[60px] gap-1 rounded border bg-[#f8f8f8] px-3.5 py-3 sm:min-h-16 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
    >
      <span className="font-bold">
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-label="обязательное поле">
            *
          </span>
        ) : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        list={list}
        aria-invalid={Boolean(error)}
        aria-required={required}
        className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#656565]/50 sm:text-xs"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </label>
  );
}

export function CitySelectField({
  label,
  placeholder,
  value,
  error,
  required = false,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}>) {
  const [isFocused, setIsFocused] = useState(false);
  const suggestions = getRussianCitySuggestions(value);
  const showSuggestions = isFocused && value.trim().length > 0 && suggestions.length > 0;

  const handleSelect = (city: string) => {
    onChange(city);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <label
        className={`grid min-h-[60px] gap-1 rounded border bg-[#f8f8f8] px-3.5 py-3 sm:min-h-16 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
      >
        <span className="font-bold">
          {label}
          {required ? (
            <span className="ml-1 text-red-600" aria-label="обязательное поле">
              *
            </span>
          ) : null}
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-required={required}
          className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#656565]/50 sm:text-xs"
        />
        {error ? <FieldErrorMessage message={error} /> : null}
      </label>

      {showSuggestions ? (
        <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-30 overflow-hidden rounded-2xl border border-[#e8c880] bg-white shadow-[0_-14px_40px_rgba(15,23,42,0.16)]">
          <div className="max-h-[190px] overflow-y-auto py-2">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(city);
                }}
                className="block w-full px-4 py-3 text-left text-sm font-bold text-[#0f172a] transition hover:bg-[#fff4d8]"
              >
                {city}
              </button>
            ))}
          </div>
          <p className="border-t border-[#e8c880]/40 px-4 py-2 text-xs text-[#656565]">
            Выберите город из списка
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function FormFieldTextarea({
  label,
  placeholder,
  value,
  error,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}>) {
  return (
    <div
      className={`rounded border bg-[#f8f8f8] px-3.5 py-3 sm:px-4 ${error ? "border-red-500" : "border-transparent"}`}
    >
      <p className="text-base font-bold text-[#0f172a]">{label}</p>
      <textarea
        placeholder={placeholder}
        value={value}
        title={label}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full resize-none bg-transparent text-sm text-[#0f172a] placeholder-[rgba(101,101,101,0.5)] outline-none"
      />
      {error ? <FieldErrorMessage message={error} /> : null}
    </div>
  );
}

export function RequiredFieldsNote() {
  return (
    <p className="text-xs text-[#656565]">
      <span className="font-bold text-red-600">*</span> обязательные поля
    </p>
  );
}

export function FormErrorSummary({ message }: Readonly<{ message: string }>) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700">
      {message}
    </div>
  );
}

export function FieldErrorMessage({ message }: Readonly<{ message: string }>) {
  return <span className="mt-1 text-xs font-bold text-red-600">{message}</span>;
}
