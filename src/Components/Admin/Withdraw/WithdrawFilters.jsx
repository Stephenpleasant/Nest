export default function WithdrawFilters({ filters, onChange, total, loading }) {
    const handleChange = (key, value) => {
      onChange({ ...filters, [key]: value, page: 1 });
    };
  
    const activeCount = [
      filters.status, filters.type, filters.userType,
    ].filter(Boolean).length;
  
    const clearAll = () =>
      onChange({ page: 1, limit: filters.limit ?? 10 });
  
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
  
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Status
            </label>
            <select
              value={filters.status ?? ""}
              onChange={(e) => handleChange("status", e.target.value || undefined)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50
                         text-gray-700 font-medium focus:outline-none focus:ring-2
                         focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
            >
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
  
          {/* Type */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Type
            </label>
            <select
              value={filters.type ?? ""}
              onChange={(e) => handleChange("type", e.target.value || undefined)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50
                         text-gray-700 font-medium focus:outline-none focus:ring-2
                         focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
            >
              <option value="">All types</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
  
          {/* User Type */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              User
            </label>
            <select
              value={filters.userType ?? ""}
              onChange={(e) => handleChange("userType", e.target.value || undefined)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50
                         text-gray-700 font-medium focus:outline-none focus:ring-2
                         focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
            >
              <option value="">All users</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
          </div>
  
          {/* Rows per page */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Per page
            </label>
            <select
              value={filters.limit ?? 10}
              onChange={(e) => handleChange("limit", Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50
                         text-gray-700 font-medium focus:outline-none focus:ring-2
                         focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n} rows</option>
              ))}
            </select>
          </div>
  
          {/* Spacer */}
          <div className="flex-1" />
  
          {/* Clear filters */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500
                         hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2
                         rounded-xl transition-all"
            >
              ✕ Clear filters
              <span className="bg-red-500 text-white text-[9px] font-bold w-4 h-4
                               rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            </button>
          )}
  
          {/* Total count */}
          {!loading && (
            <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2 rounded-xl">
              {new Intl.NumberFormat("en-NG").format(total)} record{total !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    );
  }