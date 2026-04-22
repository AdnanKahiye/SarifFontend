"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AccountService } from "@/lib/account";
import toast from "react-hot-toast";
import { Loader2, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react";

interface AccountBalanceSummaryDto {
  accountId: string;
  accountName: string;
  currencyCode: number;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export default function TransactionTable() {
  const [data, setData] = useState<AccountBalanceSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [accountType, setAccountType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Function-ka oo ah mid la isticmaali karo meel kasta
  const loadData = useCallback(async (page: number, type: string, fDate: string, tDate: string) => {
    setLoading(true);
    try {
      // API call: Waxaan u dirnay empty string search-ka
      const res = await AccountService.getBalanceAccountSummary(page, itemsPerPage, "", fDate, tDate, type);
      const apiResponse = res.data?.data;
      if (apiResponse) {
        setData(apiResponse.data || []);
        setTotalItems(apiResponse.totalRecords || 0);
      }
    } catch {
      toast.error("Failed to load balance summaries");
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Initial Load: Marka boggu furo, xogta hal mar soo rarto
  useEffect(() => {
    loadData(1, "", "", "");
  }, [loadData]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const accountTypes = ["Cash", "Bank", "Wallet", "Customer", "Loan", "Expense", "Revenue", "Capital", "RECEIVABLE", "PAYABLE"];

  return (
    <div className="bg-[#f3f3f9] dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-[#495057]">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-[15px] font-bold mb-4 uppercase tracking-wide dark:text-gray-200">Balance Summary Report</h2>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          
          {/* Header & Filters Section */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="bg-transparent text-[13px] outline-none min-w-[120px] dark:text-gray-300"
              >
                <option value="">All Types</option>
                {accountTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <input type="date" onChange={(e) => setFromDate(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-[13px] bg-white dark:bg-gray-900 outline-none dark:text-gray-300" />
              <span className="text-gray-400 text-[12px]">to</span>
              <input type="date" onChange={(e) => setToDate(e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 text-[13px] bg-white dark:bg-gray-900 outline-none dark:text-gray-300" />
            </div>

            <button 
              onClick={() => { setCurrentPage(1); loadData(1, accountType, fromDate, toDate); }}
              className="bg-[#299cdb] text-white px-6 py-2 rounded text-[13px]  ml-auto transition-all"
            >
              Show Report
            </button>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto relative min-h-[300px]">
             {loading && (
              <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#405189]" size={30} />
              </div>
            )}
             <table className="w-full text-left border-collapse">
              <thead className="bg-[#f3f6f9] dark:bg-gray-700/50 text-[#878a99] text-[13px] font-bold uppercase border-y border-gray-200">
                <tr>
                  <th className="p-3">Account Name</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Total Debit</th>
                  <th className="p-3">Total Credit</th>
                  <th className="p-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.accountId} className="text-[13px] hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                      <td className="p-3">{item.accountName}</td>
                      <td className="p-3">{item.currencyCode}</td>
                      <td className="p-3">{item.totalDebit?.toFixed(2)}</td>
                      <td className="p-3">${item.totalCredit?.toFixed(2)}</td>
                      <td className="p-3 font-bold">${item.balance?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
                  {/* Pagination Footer - Sida asalkii hore */}
         <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
           <span className="text-[13px] text-[#878a99]">
             Showing <span className="font-semibold">{startIndex}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItems}</span> Results
           </span>
           <div className="flex items-center gap-1">
             <button 
               disabled={currentPage === 1 || loading}
               onClick={() => setCurrentPage(p => p - 1)}
               className="p-1.5 border border-gray-200 dark:border-gray-700 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
             >
               <ChevronLeft size={16} />
             </button>
             
             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
               <button
                 key={page}
                 onClick={() => setCurrentPage(page)}
                 className={`px-3 py-1.5 rounded text-[13px] transition-all ${
                   currentPage === page 
                     ? "bg-[#405189] text-white shadow-md font-bold" 
                     : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                 }`}
               >
                 {page}
               </button>
             ))}
         
             <button 
               disabled={currentPage >= totalPages || loading}
               onClick={() => setCurrentPage(p => p + 1)}
               className="p-1.5 border border-gray-200 dark:border-gray-700 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
             >
               <ChevronRight size={16} />
             </button>
           </div>
         </div>
        </div>
      </div>
    </div>
  );
}