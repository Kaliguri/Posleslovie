"use client";

import { useState } from "react";

import type { CheckoutCallScheduling, CheckoutErrors } from "@/features/checkout/model/types";
import {
  CALL_TIME_SLOTS,
  RUSSIAN_MONTHS,
  RUSSIAN_WEEKDAYS,
  getSelectableCallDateKeys,
  parseLocalDateKey,
  toLocalDateKey,
} from "@/features/checkout/model/validation";

import { FieldErrorMessage } from "./FormParts";

export function CheckoutStep3Form({
  scheduling,
  errors,
  onSchedulingChange,
}: Readonly<{
  scheduling: CheckoutCallScheduling;
  errors: CheckoutErrors;
  onSchedulingChange: (patch: Partial<CheckoutCallScheduling>) => void;
}>) {
  const schedulingDisabled = scheduling.skipScheduling;

  return (
    <div className="text-center sm:text-left">
      <h3 className="text-[21px] font-extrabold sm:text-2xl">Созвон с менеджером</h3>
      <div className="mt-3 h-[3px] rounded-full bg-[#c5c5c5] sm:mt-4" />
      <div className="mt-5 grid gap-4 sm:mt-6">
        <label className="flex items-start gap-3 text-left">
          <input
            type="checkbox"
            checked={scheduling.skipScheduling}
            onChange={(event) => onSchedulingChange({ skipScheduling: event.target.checked })}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#0f172a]"
          />
          <span className="text-base font-bold text-[#0f172a]">Не назначать время звонка</span>
        </label>

        <div className={schedulingDisabled ? "pointer-events-none opacity-45" : ""}>
          <div className="rounded bg-[#f8f8f8] px-3.5 py-3 sm:px-4">
            <p className="text-base font-bold text-[#0f172a]">Время звонка</p>
            <select
              title="Call time"
              value={scheduling.time}
              disabled={schedulingDisabled}
              onChange={(event) => onSchedulingChange({ time: event.target.value })}
              aria-invalid={Boolean(errors.callTime)}
              className="mt-2 w-full bg-transparent text-sm text-[#0f172a] outline-none disabled:cursor-not-allowed"
            >
              {CALL_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.callTime ? <FieldErrorMessage message={errors.callTime} /> : null}
          </div>

          <div className="mt-4">
            <CheckoutCallCalendar
              selectedDate={scheduling.date}
              disabled={schedulingDisabled}
              onSelectDate={(date) => onSchedulingChange({ date })}
            />
            {errors.callDate ? <FieldErrorMessage message={errors.callDate} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutCallCalendar({
  selectedDate,
  disabled = false,
  onSelectDate,
}: Readonly<{
  selectedDate: string;
  disabled?: boolean;
  onSelectDate: (dateKey: string) => void;
}>) {
  const selectableDateKeys = getSelectableCallDateKeys();
  const selectableSet = new Set(selectableDateKeys);
  const initialMonth = parseLocalDateKey(selectedDate || selectableDateKeys[0]);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  );

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const monthEnd = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0);
  const leadingEmptyDays = (monthStart.getDay() + 6) % 7;
  const daysInMonth = monthEnd.getDate();

  const calendarCells: Array<{ key: string; day: number; selectable: boolean } | null> = [
    ...Array.from({ length: leadingEmptyDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
      const key = toLocalDateKey(date);
      return { key, day, selectable: selectableSet.has(key) };
    }),
  ];

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const minMonth = parseLocalDateKey(selectableDateKeys[0]);
  const maxMonth = parseLocalDateKey(selectableDateKeys[selectableDateKeys.length - 1]);
  const canGoPrev =
    visibleMonth.getFullYear() > minMonth.getFullYear() ||
    (visibleMonth.getFullYear() === minMonth.getFullYear() &&
      visibleMonth.getMonth() > minMonth.getMonth());
  const canGoNext =
    visibleMonth.getFullYear() < maxMonth.getFullYear() ||
    (visibleMonth.getFullYear() === maxMonth.getFullYear() &&
      visibleMonth.getMonth() < maxMonth.getMonth());

  return (
    <div
      className={`rounded-[28px] border border-[#ececec] bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-5 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold text-[#0f172a] sm:text-xl">
          {RUSSIAN_MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Previous month"
            disabled={disabled || !canGoPrev}
            onClick={() =>
              setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            title="Next month"
            disabled={disabled || !canGoNext}
            onClick={() =>
              setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm font-semibold text-[#9a9b9c] sm:text-base">
        {RUSSIAN_WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-1">
            {weekday}
          </span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {calendarCells.map((cell, index) =>
          cell ? (
            <button
              key={cell.key}
              type="button"
              title={`Select ${cell.key}`}
              disabled={disabled || !cell.selectable}
              onClick={() => onSelectDate(cell.key)}
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition sm:h-11 sm:w-11 ${
                selectedDate === cell.key
                  ? "bg-[#e8c880] text-[#0f172a]"
                  : cell.selectable
                    ? "text-[#0f172a] hover:bg-[#f3f3f3]"
                    : "cursor-not-allowed text-[#c5c5c5]"
              }`}
            >
              {cell.day}
            </button>
          ) : (
            <span key={`empty-${index}`} aria-hidden="true" className="h-10 sm:h-11" />
          ),
        )}
      </div>
    </div>
  );
}
