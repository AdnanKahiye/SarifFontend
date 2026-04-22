"use client";

import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { X, ArrowRightLeft } from "lucide-react";
import { AccountService } from "@/lib/account";

export interface ExchangeDetail {
  accountId: string;
  amount: number;
  entryType: 1 | 2;
  currencyId: number;
}

export interface ExchangeFormData {
  transactionType: number;
  description: string;
  totalAmount: number;
  exchangeRate: number;
  fee: number;
  profit: number;
  details: [ExchangeDetail, ExchangeDetail];
}

const emptyForm: ExchangeFormData = {
  transactionType: 4,
  description: "",
  totalAmount: 0,
  exchangeRate: 0,
  fee: 0,
  profit: 0,
  details: [
    { accountId: "", amount: 0, entryType: 2, currencyId: 0 },
    { accountId: "", amount: 0, entryType: 1, currencyId: 0 },
  ],
};

export default function ExchangeFormModal({ open, onClose, onSubmit }: any) {
  const [form, setForm] = useState<ExchangeFormData>(emptyForm);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    Promise.all([
      AccountService.getAccountExchangeLookup(),
      AccountService.getCurrencyLookup(),
    ])
      .then(([a, c]) => {
        setAccounts(a.data?.data || []);
        setCurrencies(c.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, [open]);

  // amount calc
  useEffect(() => {
    const dest = form.totalAmount * form.exchangeRate;

    setForm((p) => ({
      ...p,
      details: [
        { ...p.details[0], amount: form.totalAmount },
        { ...p.details[1], amount: dest },
      ],
    }));
  }, [form.totalAmount, form.exchangeRate]);

  // ✅ AUTO DESCRIPTION (hidden)
  useEffect(() => {
    const from = currencies.find((x) => x.id === form.details[0].currencyId)?.name;
    const to = currencies.find((x) => x.id === form.details[1].currencyId)?.name;

    if (from && to && form.totalAmount > 0) {
      const desc = `Sarifka ${from} ${form.totalAmount} loona beddelay ${to} ${form.totalAmount * form.exchangeRate}`;
      setForm((p) => ({ ...p, description: desc }));
    }
  }, [form.totalAmount, form.exchangeRate, form.details, currencies]);

  // ✅ FIXED VALIDATION
const validate = () => {
  const e: any = {};

  if (!form.totalAmount || form.totalAmount <= 0) e.amount = "Amount required";
  if (!form.exchangeRate || form.exchangeRate <= 0) e.rate = "Rate required";

  if (!form.details[0].accountId) e.source = "Select source";
  if (!form.details[1].accountId) e.dest = "Select destination";

  if (!form.details[0].currencyId) e.cur1 = "Select currency";
  if (!form.details[1].currencyId) e.cur2 = "Select currency";

  if (form.details[0].accountId === form.details[1].accountId)
    e.dest = "Same account not allowed";

  // ✅ NEW: currency must be different
  if (
    form.details[0].currencyId &&
    form.details[1].currencyId &&
    form.details[0].currencyId === form.details[1].currencyId
  ) {
    e.cur2 = "Cannot exchange same currency";
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};

  const update = (k: any, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const updateDetail = (i: number, k: any, v: any) => {
    setForm((p) => {
      const d = [...p.details];
      d[i] = { ...d[i], [k]: v };
      return { ...p, details: d as any };
    });
  };

  const accOpt = accounts.map((a) => ({ value: a.id, label: a.name }));
  const curOpt = currencies.map((c) => ({ value: c.id, label: c.name }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl p-5">

<div className="flex justify-between items-center mb-3">
  <h3 className="font-bold text-lg">Exchange</h3>
  <button
    onClick={onClose}
    className="p-1 hover:bg-gray-100 rounded-full"
  >
    <X className="w-5 h-5 text-gray-500" />
  </button>
</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Source Account</Label>
            <Select onChange={(v: any) => updateDetail(0, "accountId", v.value)} options={accOpt} />
            {errors.source && <p className="text-red-500 text-xs">{errors.source}</p>}
          </div>

          <div>
            <Label>Destination Account</Label>
            <Select onChange={(v: any) => updateDetail(1, "accountId", v.value)} options={accOpt} />
            {errors.dest && <p className="text-red-500 text-xs">{errors.dest}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label>Currency From</Label>
            <Select onChange={(v: any) => updateDetail(0, "currencyId", v.value)} options={curOpt} />
            {errors.cur1 && <p className="text-red-500 text-xs">{errors.cur1}</p>}
          </div>

          <div>
            <Label>Currency To</Label>
            <Select onChange={(v: any) => updateDetail(1, "currencyId", v.value)} options={curOpt} />
            {errors.cur2 && <p className="text-red-500 text-xs">{errors.cur2}</p>}
          </div>
        </div>

        {/* Amount AFTER selection */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <Label>Amount</Label>
            <Input type="number" onChange={(e: any) => update("totalAmount", Number(e.target.value))} />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
          </div>

          <div>
            <Label>Rate</Label>
            <Input type="number" onChange={(e: any) => update("exchangeRate", Number(e.target.value))} />
            {errors.rate && <p className="text-red-500 text-xs">{errors.rate}</p>}
          </div>
        </div>


        <div className="grid grid-cols-2 gap-3 mt-3">
  <div>
    <Label>Fee</Label>
    <Input
      type="number"
      value={form.fee}
      onChange={(e: any) => update("fee", Number(e.target.value))}
    />
  </div>

  <div>
    <Label>Profit</Label>
    <Input
      type="number"
      value={form.profit}
      onChange={(e: any) => update("profit", Number(e.target.value))}
    />
  </div>
</div>

        <button
          onClick={() => validate() && onSubmit(form)}
          className="w-full bg-blue-600 text-white mt-4 py-2 rounded"
        >
          Save
        </button>

      </div>
    </div>
  );
}