"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AccountService } from "@/lib/account";
import toast from "react-hot-toast";
import { Loader2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DailyReportDto {
  date: string;
  totalIn: number;
  totalOut: number;
  balance: number;
}

export default function DailyReportTable() {
  const [data, setData] = useState<DailyReportDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Default: Taariikhda maanta
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadData = useCallback(async (page: number, fDate: string, tDate: string) => {
    setLoading(true);
    try {
      const res = await AccountService.getDailyReport(page, itemsPerPage, fDate, tDate);
      
      if (res.data && res.data.success) {
        const responseData = res.data.data;
        setData(responseData.data || []);
        setTotalItems(responseData.totalRecords || 0);
        setTotalPages(responseData.totalPages || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Failed to load Daily Report");
    } finally {
      setLoading(false);
    }
  }, []);

  // Xisaabinta StartIndex iyo EndIndex
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // useEffect-kan waxa uu shaqaynayaa oo kaliya markii Page-ka la badalo
  useEffect(() => {
    loadData(currentPage, fromDate, toDate);
  }, [currentPage, loadData]); 

  return (
    <div className="bg-[#f3f3f9] dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-[#495057]">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-[15px] font-bold mb-4 uppercase tracking-wide dark:text-gray-200">Daily Report</h2>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          {/* Header & Filters */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
              <Calendar size={14} className="text-gray-400" />
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)} 
                className="bg-transparent text-[13px] outline-none dark:text-gray-300" 
              />
              <span className="text-gray-400 text-[12px]">to</span>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)} 
                className="bg-transparent text-[13px] outline-none dark:text-gray-300" 
              />
            </div>
            <button 
              onClick={() => loadData(1, fromDate, toDate)} 
              className="bg-[#299cdb] text-white px-6 py-2 rounded text-[13px] ml-auto hover:bg-[#2386bd] transition-all"
            >
              Show Report
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#405189]" size={30} />
              </div>
            )}
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f3f6f9] dark:bg-gray-700/50 text-[#878a99] text-[13px] font-bold uppercase border-y border-gray-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total In</th>
                  <th className="p-3">Total Out</th>
                  <th className="p-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length > 0 ? data.map((item, index) => (
                  <tr key={index} className="text-[13px] hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                    <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-3 text-green-600 font-semibold">{item.totalIn.toFixed(2)}</td>
                    <td className="p-3 text-red-600 font-semibold">{item.totalOut.toFixed(2)}</td>
                    <td className={`p-3 font-bold ${item.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                      {item.balance.toFixed(2)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <span className="text-[13px] text-[#878a99]">
              Showing <span className="font-semibold">{totalItems > 0 ? startIndex : 0}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItems}</span> Results
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