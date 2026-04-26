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
export interface CreateExpenseRequest {
  transactionType: number;
  description: string;
  expense: {
    title: string;
    amount: number;
    accountId: string;     // Expense Account
    cashAccountId: string; // Cash Account
  };
}

/* ================================
   EMPTY FORM
================================ */
const emptyForm: CreateExpenseRequest = {
  transactionType: 7,
  description: "",
  expense: {
    title: "",
    amount: 0,
    accountId: "",
    cashAccountId: "",
  },
};

export default function ExpenseFormModal({
  open,
  onClose,
  onSubmit,
}: any) {

  const [form, setForm] = useState<CreateExpenseRequest>(emptyForm);

  // ✅ SEPARATE STATES
  const [expenseAccounts, setExpenseAccounts] = useState<any[]>([]);
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);

  const [errors, setErrors] = useState<any>({});

  /* ================================
     LOAD ACCOUNTS (STRICT APIs)
  ================================= */
  useEffect(() => {
    if (!open) return;

    // ✅ Expense Accounts ONLY
    AccountService.getAccountExpensesLookup().then((res) => {
      setExpenseAccounts(res.data?.data || []);
    });

    // ✅ Cash Accounts ONLY
    AccountService.getAccountExchangeLookup().then((res) => {
      setCashAccounts(res.data?.data || []);
    });

  }, [open]);

  /* ================================
     RESET FORM
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
  const updateExpense = (key: keyof CreateExpenseRequest["expense"], value: any) => {
    setForm((prev) => ({
      ...prev,
      expense: {
        ...prev.expense,
        [key]: value,
      },
    }));
  };

  /* ================================
     VALIDATION
  ================================= */
  const validate = () => {
    const e: any = {};

    if (!form.expense.title)
      e.title = "Title is required";

    if (!form.expense.amount || form.expense.amount <= 0)
      e.amount = "Amount must be greater than 0";

    if (!form.expense.accountId)
      e.account = "Expense account required";

    if (!form.expense.cashAccountId)
      e.cash = "Cash account required";

    if (!form.description)
      e.description = "Description is required";

    // 🚫 prevent same account
    if (form.expense.accountId === form.expense.cashAccountId)
      e.cash = "Cash account cannot be same as expense account";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================================
     OPTIONS
  ================================= */
  const expenseOptions = expenseAccounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const cashOptions = cashAccounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="relative flex items-center justify-center mb-4">
          <h3 className="font-bold text-lg">Add Expense</h3>
          <button
            onClick={onClose}
            className="absolute right-0 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* TITLE */}
        <div className="mb-3">
          <Label>Title</Label>
          <Input
            placeholder="e.g. Rent, Salary"
            value={form.expense.title}
            onChange={(e: any) =>
              updateExpense("title", e.target.value)
            }
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>

        {/* AMOUNT */}
        <div className="mb-3">
          <Label>Amount</Label>
          <Input
            type="number"
            value={form.expense.amount || ""}
            onChange={(e: any) =>
              updateExpense("amount", Number(e.target.value))
            }
          />
          {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
        </div>
{/* EXPENSE ACCOUNT */}
<div className="mb-3">
  <Label>Expense Account</Label>
  <Select
    options={expenseOptions}
    // Halkan ku dar value-gan si uu u aqoonsado midka la doortay
    value={expenseOptions.find(o => o.value === form.expense.accountId) || null}
    onChange={(v: any) => updateExpense("accountId", v?.value)}
  />
  {errors.account && <p className="text-red-500 text-xs">{errors.account}</p>}
</div>

{/* CASH ACCOUNT */}
<div className="mb-3">
  <Label>Cash Account</Label>
  <Select
    options={cashOptions}
    // Halkan ku dar value-gan si uu u aqoonsado midka la doortay
    value={cashOptions.find(o => o.value === form.expense.cashAccountId) || null}
    onChange={(v: any) => updateExpense("cashAccountId", v?.value)}
  />
  {errors.cash && <p className="text-red-500 text-xs">{errors.cash}</p>}
</div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <Label>Description</Label>
          <Input
            placeholder="e.g. April office rent"
            value={form.description}
            onChange={(e: any) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="w-1/2 border border-gray-300 py-2 rounded"
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