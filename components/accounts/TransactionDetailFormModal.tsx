import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  item: any; // Waxaan u isticmaalayaa any sidaad u isticmaashay
}

export default function TransactionDetailModal({ open, onClose, item }: Props) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-xl">
        <h3 className="font-bold text-lg mb-4 text-[#495057]">Transaction Details</h3>
        
        <div className="space-y-3 text-sm">
          <p><strong>Reference:</strong> {item.referenceNo}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Total Amount:</strong> ${item.totalAmount?.toFixed(2)}</p>
          
          <div className="bg-gray-50 p-3 rounded mt-4">
            <p className="text-xs font-bold uppercase text-gray-500 mb-2">Detailed Accounts:</p>
            <div className="space-y-2">
              {item.details?.map((d: any, i: number) => (
                <div key={i} className="flex justify-between border-b pb-1 last:border-0">
                  <span className="text-gray-700">{d.accountName}</span>
                  <span className="font-medium">
                    {d.entryType === 1 ? "+" : "-"} ${d.amount?.toFixed(2)} 
                    <span className="text-[10px] text-gray-400 ml-1">({d.currencyCode})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="mt-6 w-full bg-[#405189] text-white py-2 rounded text-[13px] hover:bg-[#364574] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}