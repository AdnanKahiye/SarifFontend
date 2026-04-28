"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X } from "lucide-react";
import { AccountService } from "@/lib/account";

/* ================================
   MODEL
================================ */
export interface CreateRevenueRequest {
  transactionType: number;
  description: string;
  revenue: {
    title: string;
    description: string;
    amount: number;
    revenueAccountId: string;
    cashAccountId: string;
    sourceType: number;
  };
}

/* ================================
   EMPTY FORM
================================ */
const emptyForm: CreateRevenueRequest = {
  transactionType: 8,
  description: "",
  revenue: {
    title: "",
    description: "",
    amount: 0,
    revenueAccountId: "",
    cashAccountId: "",
    sourceType: 1,
  },
};

export default function RevenueFormModal({
  open,
  onClose,
  onSubmit,
}: any) {
  const [form, setForm] = useState<CreateRevenueRequest>(emptyForm);
  const [revenueAccounts, setRevenueAccounts] = useState<any[]>([]);
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  /* ================================
     LOAD ACCOUNTS
  ================================= */
  useEffect(() => {
    if (!open) return;

    AccountService.getAccountRevenueLookup().then((res) => {
      setRevenueAccounts(res.data?.data || []);
    });

    AccountService.getAccountExchangeLookup().then((res) => {
      setCashAccounts(res.data?.data || []);
    });
  }, [open]);

  /* ================================
     RESET
  ================================= */
  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [open]);

  /* ================================
     UPDATE
  ================================= */
  const updateRevenue = (key: keyof CreateRevenueRequest["revenue"], value: any) => {
    setForm((prev) => ({
      ...prev,
      revenue: {
        ...prev.revenue,
        [key]: value,
      },
    }));
  };

  /* ================================
     VALIDATION
  ================================= */
  const validate = () => {
    const e: any = {};

    if (!form.revenue.title) e.title = "Title is required";
    if (!form.revenue.amount || form.revenue.amount <= 0)
      e.amount = "Amount must be greater than 0";
    if (!form.revenue.revenueAccountId)
      e.revenueAccount = "Revenue account required";
    if (!form.revenue.cashAccountId)
      e.cash = "Cash account required";
    if (!form.description)
      e.description = "Description is required";

    if (form.revenue.revenueAccountId === form.revenue.cashAccountId)
      e.cash = "Accounts cannot be the same";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================================
     OPTIONS
  ================================= */
  const revenueOptions = revenueAccounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const cashOptions = cashAccounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const sourceTypeOptions = [
    { value: 1, label: "Direct" },
    { value: 2, label: "Exchange" },
    { value: 3, label: "Transfer" },
    { value: 4, label: "Loan Interest" },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="relative flex items-center justify-center mb-4">
          <h3 className="font-bold text-lg">Add Revenue</h3>
          <button
            onClick={onClose}
            className="absolute right-0 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* GRID FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* TITLE */}
          <div>
            <Label>Title</Label>
            <Input
              value={form.revenue.title}
              onChange={(e: any) =>
                updateRevenue("title", e.target.value)
              }
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          {/* AMOUNT */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.revenue.amount || ""}
              onChange={(e: any) =>
                updateRevenue("amount", Number(e.target.value))
              }
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
          </div>

          {/* REVENUE ACCOUNT */}
          <div>
            <Label>Revenue Account</Label>
            <Select
              options={revenueOptions}
              value={
                revenueOptions.find(
                  (o) => o.value === form.revenue.revenueAccountId
                ) || null
              }
              onChange={(v: any) =>
                updateRevenue("revenueAccountId", v?.value)
              }
            />
            {errors.revenueAccount && (
              <p className="text-red-500 text-xs">{errors.revenueAccount}</p>
            )}
          </div>

          {/* CASH ACCOUNT */}
          <div>
            <Label>Cash Account</Label>
            <Select
              options={cashOptions}
              value={
                cashOptions.find(
                  (o) => o.value === form.revenue.cashAccountId
                ) || null
              }
              onChange={(v: any) =>
                updateRevenue("cashAccountId", v?.value)
              }
            />
            {errors.cash && <p className="text-red-500 text-xs">{errors.cash}</p>}
          </div>

        {/* SOURCE TYPE (FULL WIDTH LIKE DESCRIPTION) */}
<div className="md:col-span-2">
  <Label>Source Type</Label>
  <Select
    options={sourceTypeOptions}
    value={
      sourceTypeOptions.find(
        (o) => o.value === form.revenue.sourceType
      ) || null
    }
    onChange={(v: any) =>
      updateRevenue("sourceType", v?.value)
    }
  />
</div>

          {/* SPACER */}
          <div></div>

          {/* DESCRIPTION FULL WIDTH */}
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e: any) => {
                const value = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  description: value,
                  revenue: {
                    ...prev.revenue,
                    description: value,
                  },
                }));
              }}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="w-1/2 border py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!validate()) return;
              onSubmit(form);
            }}
            className="w-1/2 bg-[#405189] text-white py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}