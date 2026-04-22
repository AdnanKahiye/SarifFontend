"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AccountService } from "@/lib/account";
import toast from "react-hot-toast";
import { Loader2, Calendar, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Select from "react-select"; // Hubi inaad rakibtay: npm install react-select

export default function AccountStatementTable() {
  const [accounts, setAccounts] = useState<{ value: string; label: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<{ value: string; label: string } | null>(null);
  const [data, setData] = useState<any[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 10;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const today = now.toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(today);
  const [entryType, setEntryType] = useState<string>("");

  useEffect(() => {
    AccountService.getAccountsLookup().then(res => {
      if (res.data && res.data.success) {
        // Beddelida xogta si ay ugu habboonaato react-select
        const options = res.data.data.map((acc: any) => ({
          value: acc.id,
          label: acc.name
        }));
        setAccounts(options);
      }
    });
  }, []);

  const loadStatement = useCallback(async (page: number) => {
    if (!selectedAccount) {
      toast.error("Fadlan dooro Account");
      return;
    }
    setLoading(true);
    try {
      const res = await AccountService.getAccountStatement(
        selectedAccount.value, 
        page, 
        itemsPerPage, 
        entryType ? parseInt(entryType) : null, 
        fromDate, 
        toDate
      );
      if (res.data && res.data.success) {
        setData(res.data.data.data);
        setTotalPages(res.data.data.totalPages);
        setTotalRecords(res.data.data.totalRecords);
        setCurrentPage(page);
      }
    } catch {
      toast.error("Failed to load statement");
    } finally {
      setLoading(false);
    }
  }, [selectedAccount, fromDate, toDate, entryType]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <div className="bg-[#f3f3f9] dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-[#495057]">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-[15px] font-bold mb-4 uppercase tracking-wide dark:text-gray-200">Account Statement</h2>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
          
          {/* Searchable Select */}
          <div className="w-64">
            <Select
              options={accounts}
              onChange={(option) => setSelectedAccount(option)}
              placeholder="Search Account..."
              isSearchable={true}
              className="text-[13px]"
              styles={{
                control: (base) => ({ ...base, minHeight: '38px', borderRadius: '4px', borderColor: '#e5e7eb' })
              }}
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
            <Calendar size={14} className="text-gray-400" />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent text-[13px] outline-none dark:text-gray-300" />
            <span className="text-gray-400 text-[12px]">to</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent text-[13px] outline-none dark:text-gray-300" />
          </div>

          <select className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2 text-[13px] dark:text-gray-300" onChange={(e) => setEntryType(e.target.value)}>
            <option value="">All Types</option>
            <option value="1">Credit (Income)</option>
            <option value="2">Debit (Expense)</option>
          </select>

          <button onClick={() => loadStatement(1)} className="bg-[#299cdb] text-white px-6 py-2 rounded text-[13px] hover:bg-[#2386bd] transition-all ml-auto">
            Show Statement
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto relative min-h-[300px]">
            {loading && <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center"><Loader2 className="animate-spin text-[#405189]" size={30} /></div>}
            <table className="w-full text-left">
              <thead className="bg-[#f3f6f9] dark:bg-gray-700/50 text-[#878a99] text-[13px] font-bold uppercase">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.length > 0 ? data.map((item, i) => (
                  <tr key={i} className="text-[13px] hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                    <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{item.description}</td>
                    <td className="p-4">{item.referenceNo}</td>
                    <td className={`p-4 font-semibold ${item.entryType === 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <span className="text-[13px] text-[#878a99]">Showing {totalRecords > 0 ? startIndex : 0} to {endIndex} of {totalRecords} Results</span>
            <div className="flex items-center gap-1">
              <button disabled={currentPage === 1 || loading} onClick={() => loadStatement(currentPage - 1)} className="p-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
              <span className="px-3 text-[13px]">{currentPage} / {totalPages}</span>
              <button disabled={currentPage >= totalPages || loading} onClick={() => loadStatement(currentPage + 1)} className="p-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}