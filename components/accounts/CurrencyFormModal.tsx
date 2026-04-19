"use client";

import React, { useEffect, useState, useCallback } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Save } from "lucide-react";
import { AgencyFormData } from "../Registration/AgencyFormModal";

export interface CurrencyFormData {
  code: string;
  name: string;
  symbol: string; // Waxaan u deysanayaa string si uusan Modal-ku u jabin
  decimalPlaces: number;
  isBase: boolean;

}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: CurrencyFormData; // Kani waa inuu u dhigmaa interface-ka sare
  onClose: () => void;
  onSubmit: (data: CurrencyFormData) => void;
}

const emptyForm: CurrencyFormData = {
    code: "",
    name: "",
    symbol: "",
    decimalPlaces: 0,
    isBase: false,

};

export default function CurrencyFormModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CurrencyFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CurrencyFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        // Halkan ayaan xogta ku nadiifinaynaa marka Modal-ka la furayo
        setForm({
          ...initialData,
          // Haddii name uu null yahay, ka dhig ""
 
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [mode, initialData, open]);

  const update = (k: keyof CurrencyFormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.symbol.trim()) e.symbol = "Symbol is required";
    if (form.decimalPlaces === undefined || form.decimalPlaces < 0) e.decimalPlaces = "Decimal places is required";

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-none p-4">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-gray-950 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "Add New Currency" : "Edit Currency Profile"}
          </h3>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" required error={errors.name}>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full Name" />
            </Field>

            <Field label="Code" required error={errors.code}>
              <Input value={form.code} onChange={(e) => update("code", e.target.value)} placeholder="Code" />
            </Field>

            <Field label="Symbol" required error={errors.symbol}>
              <Input value={form.symbol} onChange={(e) => update("symbol", e.target.value)} placeholder="Symbol" />
            </Field>

            <Field label="Decimal Places" required error={errors.decimalPlaces}>
              <Input
                type="number"
                value={form.decimalPlaces}
                onChange={(e) => update("decimalPlaces", e.target.value)}
                placeholder="Decimal Places"
              />
            </Field>

    
          </div>

       
        </div>

        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end items-center gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            {loading ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === "add" ? "Create" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helpers
function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
    >
      {children}
    </select>
  );
}

function Field({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <Label className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
    </div>
  );
}