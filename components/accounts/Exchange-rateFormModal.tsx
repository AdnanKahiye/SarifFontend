"use client";

import React, { useEffect, useState, useCallback } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Save } from "lucide-react";
import { AccountService } from "@/lib/account";

export interface ExchangeRateFormData {
  rate: number;
  currencyId: number;
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: ExchangeRateFormData;
  onClose: () => void;
  onSubmit: (data: ExchangeRateFormData) => void;
}

const emptyForm: ExchangeRateFormData = {
  rate: 0,
  currencyId: 0,
};

export default function ExchangeRateFormModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<ExchangeRateFormData>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExchangeRateFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const [currencies, setCurrencies] = useState<
    { id: string; name: string }[]
  >([]);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  // LOAD CURRENCIES
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setCurrencyLoading(true);
        const res = await AccountService.getCurrencies(1, 100);

        const apiResponse = res.data?.data;
        setCurrencies(apiResponse?.data || []);
      } catch (err) {
        console.error("Failed to load currencies", err);
      } finally {
        setCurrencyLoading(false);
      }
    };

    if (open) fetchCurrencies();
  }, [open]);

  // INIT FORM
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          rate: initialData.rate ?? "",
          currencyId: initialData.currencyId ?? "",
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const update = (k: keyof ExchangeRateFormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e: typeof errors = {};

    if (!form.rate) e.rate = "Rate is required";
    if (!form.currencyId) e.currencyId = "Currency is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleEsc]);

  const submit = async () => {
    if (!validate() || loading) return;

    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const selectClassName =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#00bf63] outline-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-gray-950 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {mode === "add" ? "Add Exchange Rate" : "Edit Exchange Rate"}
          </h3>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* RATE */}
          <Field label="Rate" required error={errors.rate}>
            <Input
              value={form.rate}
              onChange={(e) => update("rate", e.target.value)}
              placeholder="Enter rate"
            />
          </Field>

          {/* CURRENCY */}
          <Field label="Currency" required error={errors.currencyId}>
            <select
              className={selectClassName}
              value={form.currencyId}
              onChange={(e) => update("currencyId", e.target.value)}
              disabled={currencyLoading}
            >
              <option value="">Select currency</option>

              {currencies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}

            {mode === "add" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* FIELD COMPONENT */
function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-bold text-gray-500 uppercase">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {children}

      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
