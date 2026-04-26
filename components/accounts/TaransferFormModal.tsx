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
export interface CreateTransferRequest {
  transactionType: number;
  description: string;
  transfer: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    senderName: string;
    receiverName: string;
  };
}

/* ================================
   EMPTY FORM
================================ */
const emptyForm: CreateTransferRequest = {
  transactionType: 3,
  description: "",
  transfer: {
    fromAccountId: "",
    toAccountId: "",
    amount: 0,
    senderName: "",
    receiverName: "",
  },
};

export default function TransferFormModal({
  open,
  onClose,
  onSubmit,
}: any) {

  const [form, setForm] = useState<CreateTransferRequest>(emptyForm);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});

  /* ================================
     LOAD ACCOUNTS
  ================================= */
  useEffect(() => {
    if (!open) return;

    AccountService.getAccountExchangeLookup().then((res) => {
      setAccounts(res.data?.data || []);
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
  const updateTransfer = (key: keyof CreateTransferRequest["transfer"], value: any) => {
    setForm((prev) => ({
      ...prev,
      transfer: {
        ...prev.transfer,
        [key]: value,
      },
    }));
  };

  /* ================================
     VALIDATION
  ================================= */
  const validate = () => {
    const e: any = {};

    if (!form.transfer.fromAccountId)
      e.from = "From account required";

    if (!form.transfer.toAccountId)
      e.to = "To account required";

    if (form.transfer.fromAccountId === form.transfer.toAccountId)
      e.to = "Accounts must be different";

    if (!form.transfer.amount || form.transfer.amount <= 0)
      e.amount = "Amount must be greater than 0";

    if (!form.transfer.senderName)
      e.sender = "Sender required";

    if (!form.transfer.receiverName)
      e.receiver = "Receiver required";

    if (!form.description)
      e.description = "Description required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================================
     OPTIONS
  ================================= */
  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">

        {/* HEADER */}
        <div className="relative flex items-center justify-center mb-4">
          <h3 className="font-bold text-lg">Transfer</h3>
          <button onClick={onClose} className="absolute right-0 p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* GRID FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* FROM ACCOUNT */}
          <div>
            <Label>From Account</Label>
            <Select
              options={accountOptions}
              onChange={(v: any) =>
                updateTransfer("fromAccountId", v?.value)
              }
            />
            {errors.from && <p className="text-red-500 text-xs">{errors.from}</p>}
          </div>

          {/* TO ACCOUNT */}
          <div>
            <Label>To Account</Label>
            <Select
              options={accountOptions}
              onChange={(v: any) =>
                updateTransfer("toAccountId", v?.value)
              }
            />
            {errors.to && <p className="text-red-500 text-xs">{errors.to}</p>}
          </div>

          {/* AMOUNT */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.transfer.amount || ""}
              onChange={(e: any) =>
                updateTransfer("amount", Number(e.target.value))
              }
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
          </div>

          {/* SENDER */}
          <div>
            <Label>Sender Name</Label>
            <Input
              value={form.transfer.senderName}
              onChange={(e: any) =>
                updateTransfer("senderName", e.target.value)
              }
            />
            {errors.sender && <p className="text-red-500 text-xs">{errors.sender}</p>}
          </div>

          {/* RECEIVER */}
          <div>
            <Label>Receiver Name</Label>
            <Input
              value={form.transfer.receiverName}
              onChange={(e: any) =>
                updateTransfer("receiverName", e.target.value)
              }
            />
            {errors.receiver && <p className="text-red-500 text-xs">{errors.receiver}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e: any) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="w-1/2 border py-2 rounded">
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