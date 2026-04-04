const fmtMoney = (val) => {
    if (val == null) return "—";
    if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000)     return `₦${(val / 1_000).toFixed(2)}K`;
    return `₦${Number(val).toLocaleString("en-NG")}`;
  };
  
  const fmtDate = (val) => {
    if (!val) return "—";
    try {
      return new Date(val).toLocaleDateString("en-NG", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return val; }
  };
  
  function StatusBadge({ status }) {
    const map = {
      success:  "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending:  "bg-amber-50   text-amber-700   border-amber-200",
      failed:   "bg-red-50     text-red-600     border-red-200",
    };
    const cls = map[status?.toLowerCase()] ?? "bg-gray-50 text-gray-500 border-gray-200";
    const dot = {
      success: "bg-emerald-500",
      pending: "bg-amber-500",
      failed:  "bg-red-500",
    }[status?.toLowerCase()] ?? "bg-gray-400";
  
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {status ?? "unknown"}
      </span>
    );
  }
  
  function TypeBadge({ type }) {
    const map = {
      withdrawal: "bg-blue-50 text-blue-700",
      deposit:    "bg-violet-50 text-violet-700",
      transfer:   "bg-orange-50 text-orange-700",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[type?.toLowerCase()] ?? "bg-gray-50 text-gray-500"}`}>
        {type ?? "—"}
      </span>
    );
  }
  
  function SkeletonRow() {
    return (
      <tr className="animate-pulse">
        {[...Array(7)].map((_, i) => (
          <td key={i} className="px-5 py-4">
            <div className="h-3.5 rounded-full bg-gray-100" style={{ width: `${60 + Math.random() * 40}%` }} />
          </td>
        ))}
      </tr>
    );
  }
  
  export default function WithdrawTable({ data, loading, error, meta, onPageChange }) {
    const { page, totalPages, total, limit } = meta;
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to   = Math.min(page * limit, total);
  
    const COLS = ["Ref / ID", "User", "Type", "Amount", "Status", "User Type", "Date"];
  
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}
  
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {COLS.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? [...Array(limit > 10 ? 10 : limit)].map((_, i) => <SkeletonRow key={i} />)
                : data.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">📭</span>
                          <p className="font-semibold text-gray-500">No transactions found</p>
                          <p className="text-xs">Try adjusting your filters</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : data.map((tx, i) => (
                    <tr
                      key={tx._id ?? tx.id ?? i}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Ref */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-white">
                          {(tx.reference ?? tx.ref ?? tx._id ?? "—").toString().slice(0, 16)}…
                        </span>
                      </td>
  
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {(tx.user?.name ?? tx.userName ?? tx.email ?? "U")[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                              {tx.user?.name ?? tx.userName ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[140px]">
                              {tx.user?.email ?? tx.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </td>
  
                      {/* Type */}
                      <td className="px-5 py-4">
                        <TypeBadge type={tx.type} />
                      </td>
  
                      {/* Amount */}
                      <td className="px-5 py-4 font-bold text-gray-800 tabular-nums">
                        {fmtMoney(tx.amount)}
                      </td>
  
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
  
                      {/* User Type */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                          {tx.userType ?? tx.user?.role ?? "—"}
                        </span>
                      </td>
  
                      {/* Date */}
                      <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {fmtDate(tx.createdAt ?? tx.date)}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400 font-medium">
              Showing <span className="font-bold text-gray-600">{from}–{to}</span> of{" "}
              <span className="font-bold text-gray-600">{new Intl.NumberFormat("en-NG").format(total)}</span> transactions
            </p>
  
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center
                           text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                           disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-bold"
              >
                ‹
              </button>
  
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1
                  : page <= 3 ? i + 1
                  : page >= totalPages - 2 ? totalPages - 4 + i
                  : page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border
                      ${p === page
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
  
              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center
                           text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                           disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-bold"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }