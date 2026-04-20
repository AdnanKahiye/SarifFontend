"use client";

import React, { useEffect, useState, useCallback } from "react";
import DetailViewModelFormModal from "./TransactionDetailFormModal";
import ConfirmDeleteModal from "../ui/Model/ConfirmDeleteModal";
import { AccountService } from "@/lib/account";
import toast from "react-hot-toast";
import { usePermission } from "@/context/PermissionContext";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionDto {
  id: string;
  transactionType: number;
  status: number;
  referenceNo: string | null;
  description: string | null;
  totalAmount: number;
  agencyName: string;
  userName: string;
  details: any[]; // Waxaan ka dhigay any[] si uu u qaado array-gaaga
}

export default function TransactionTable() {
  const { hasPermission } = usePermission();
  
  const [data, setData] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionDto | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await AccountService.getTransactionHistory(page, itemsPerPage);
      const apiResponse = res.data?.data;
      if (apiResponse) {
        setData(apiResponse.data || []);
        setTotalItems(apiResponse.totalRecords || 0);
      }
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, loadData]);

  const confirmDelete = async () => {
    if (!selectedItem) return;
    setDeleting(true);
    try {
      await AccountService.deleteTransaction(selectedItem.id);
      toast.success("Transaction deleted");
      setOpenDelete(false);
      loadData(currentPage);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-[#f3f3f9] dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-[#495057]">
      <div className="mx-auto max-w-7xl">
             {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold dark:text-gray-200 uppercase tracking-wide">Transaction List</h2>
          <div className="text-[13px] font-medium">
            Account <span className="text-gray-400 mx-1">&gt;</span> <span className="text-gray-400">Transactions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <button className="bg-[#0ab39c] text-white px-4 py-2 rounded text-[13px] opacity-80 cursor-not-allowed">
              + Add Transaction
            </button>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded text-[13px] focus:outline-none dark:bg-gray-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="overflow-x-auto relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#405189]" size={30} />
              </div>
            )}
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f3f6f9] dark:bg-gray-700/50 text-[#878a99] text-[13px] font-bold uppercase border-y border-gray-200">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Agency</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="text-[13px] hover:bg-gray-50">
                    <td className="p-3">{item.transactionType}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3">{item.referenceNo}</td>
                    <td className="p-3">${item.totalAmount?.toFixed(2)}</td>
                    <td className="p-3">{item.agencyName}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => { setSelectedItem(item); setOpenModal(true); }} 
                          className="bg-[#299cdb] text-white px-3 py-1 rounded text-[11px]"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(item); setOpenDelete(true); }} 
                          className="bg-[#f06548] text-white px-3 py-1 rounded text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {/* Modal-ka oo laga saaray table-ka */}
    {/* Halkan ku beddel initialData -> item */}
<DetailViewModelFormModal
  open={openModal}
  item={selectedItem || undefined} 
  onClose={() => setOpenModal(false)}
/>

      <ConfirmDeleteModal 
        open={openDelete} 
        loading={deleting} 
        onClose={() => setOpenDelete(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}