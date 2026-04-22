import React from "react";
import { X, FileText, CreditCard, DollarSign, ArrowRightLeft } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  item: any;
}

export default function TransactionDetailModal({ open, onClose, item }: Props) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#405189]">
            <FileText size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Transaction Details</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Reference No</p>
              <p className="font-semibold text-gray-700">{item.referenceNo || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Agency</p>
              <p className="font-semibold text-gray-700">{item.agencyName}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Description</p>
            <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">{item.description}</p>
          </div>
          
          <div className="bg-[#405189]/5 p-4 rounded-lg flex justify-between items-center border border-[#405189]/10">
             <span className="text-sm font-bold text-[#405189]">TOTAL AMOUNT</span>
             <span className="text-lg font-bold text-[#405189] flex items-center">
               <DollarSign size={18} /> {item.totalAmount?.toFixed(2)}
             </span>
          </div>
          
          <div className="mt-4">
            <p className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
              <ArrowRightLeft size={14} /> Breakdown
            </p>
            <div className="space-y-1">
              {item.details?.map((d: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    <span className="text-gray-700 font-medium">{d.accountName}</span>
                  </div>
                  <span className={`font-mono ${d.entryType === 1 ? "text-emerald-600" : "text-rose-600"}`}>
                    {d.entryType === 1 ? "+" : "-"} {d.amount?.toFixed(2)} 
                    <span className="text-[10px] text-gray-400 ml-1">USD</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="w-full bg-[#405189] text-white py-2.5 rounded shadow-lg hover:bg-[#364574] transition-all font-medium text-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}