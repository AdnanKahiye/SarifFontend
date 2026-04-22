"use client";

import React, { useEffect, useState, useCallback } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, Save, User } from "lucide-react";

export interface AccountFormData {
    // id: string;
    name: string;
    accountType: number;
    referenceId: string; // 0 for Male, 1 for Female
    currencyId: number;
    // currencyId: number;

}

interface Props {
    open: boolean;
    mode: "add" | "edit";
    initialData?: AccountFormData;
    onClose: () => void;
    onSubmit: (data: AccountFormData) => void;
}

const emptyForm: AccountFormData = {
    // id: "",
    name: "",
    accountType: 0, // Default to Male
    referenceId: "",
    currencyId: 0,
};

export default function CustomerFormModal({ open, mode, initialData, onClose, onSubmit }: Props) {
    const [form, setForm] = useState<AccountFormData>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof AccountFormData, string>>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                setForm({ ...initialData });
            } else {
                setForm(emptyForm);
            }
            setErrors({});
        }
    }, [mode, initialData, open]);

    const update = (k: keyof AccountFormData, v: string | number) => {
        setForm((p) => ({ ...p, [k]: v }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    };

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.referenceId.trim()) e.referenceId = "Reference ID is required";
        if (form.currencyId === 0) e.currencyId = "Currency is required";

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

    const selectClassName = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#090044] focus:ring-2 focus:ring-[#00bf63] outline-none appearance-none transition-all";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 p-4">
            <div
                className="relative w-full max-w-2xl bg-white dark:bg-gray-950 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">

                        {mode === "add" ? "New Customer" : "Edit Customer"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Name */}
                        <Field label="Account Name" required error={errors.name}>
                            <Input
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="Enter account name"
                            />
                        </Field>

                        {/* Account Type */}
                        <Field label="Account Type" required>
                            <select
                                value={form.accountType}
                                onChange={(e) => update("accountType", Number(e.target.value))}
                                className={selectClassName}
                            >
                                <option value={0}>Main</option>
                                <option value={1}>Sub</option>
                            </select>
                        </Field>

                        {/* Reference ID */}
                        <Field label="Reference ID" required error={errors.referenceId}>
                            <Input
                                value={form.referenceId}
                                onChange={(e) => update("referenceId", e.target.value)}
                                placeholder="Enter reference ID"
                            />
                        </Field>

                        {/* Currency ID */}
                        <Field label="Currency ID" required error={errors.currencyId}>
                            <Input
                                type="number"
                                value={form.currencyId}
                                onChange={(e) => update("currencyId", Number(e.target.value))}
                                placeholder="Enter currency ID"
                            />
                        </Field>

                    </div>
                </div>

                {/* Footer */}
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
                        className="flex items-center gap-2 px-6 py-2 bg-[#405189] hover:bg-[#364473] text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {mode === "add" ? "Save Customer" : "Edit Customer"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helpers
function Field({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
    return (
        <div className="space-y-1">
            <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {children}
            {error && <p className="text-[10px] font-medium text-red-500 pl-1">{error}</p>}
        </div>
    );
}