import React from 'react';

const DataTable = ({ columns, data, loading, emptyMessage = "No data found" }) => {
  if (loading) {
    return (
      <div className="w-full bg-[#1c1c21] rounded-2xl border border-[#27272a] overflow-hidden animate-pulse">
        <div className="h-16 bg-[#27272a]/50 border-b border-[#27272a]" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 border-b border-[#27272a]/50 last:border-0" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-[#1c1c21] rounded-2xl border border-[#27272a] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#27272a] rounded-full flex items-center justify-center mb-4 text-zinc-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-zinc-300 font-bold text-lg mb-1">{emptyMessage}</h3>
        <p className="text-zinc-500 text-sm">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1c1c21] rounded-2xl border border-[#27272a] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#27272a]/30 border-b border-[#27272a]">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 text-[11px] font-black text-zinc-500 uppercase tracking-widest ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272a]/50">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors group">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-6 py-4 text-sm text-zinc-300 ${col.className || ''}`}>
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
