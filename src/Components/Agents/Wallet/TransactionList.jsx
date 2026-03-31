import { ArrowDownIcon, ArrowUpIcon } from "./Icons";
import { fmt } from "./data";

const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "paid":
      return "text-green-600 bg-green-600/10";
    case "pending":
      return "text-amber-600 bg-amber-500/10";
    case "failed":
    case "rejected":
      return "text-red-600 bg-red-500/10";
    case "approved":
      return "text-blue-600 bg-blue-500/10";
    default:
      return "text-gray-500 bg-gray-100";
  }
};

export default function TransactionList({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <span className="text-base font-bold text-[#0b1a2e]">Transaction History</span>
        <span className="text-xs text-gray-400">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Rows */}
      {transactions.map((tx, idx) => (
        <div
          key={tx.id}
          className={`flex items-center justify-between px-6 py-4 hover:bg-blue-50/40 transition-colors ${
            idx < transactions.length - 1 ? "border-b border-gray-100" : ""
          }`}
        >
          {/* Left */}
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl grid place-items-center flex-shrink-0 ${
              tx.type === "credit"
                ? "bg-green-600/10 text-green-600"
                : "bg-red-600/10 text-red-600"
            }`}>
              {tx.type === "credit" ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0b1a2e] mb-0.5">{tx.label}</div>
              <div className="text-xs text-gray-400">{tx.date}</div>
            </div>
          </div>

          {/* Right */}
          <div className="text-right">
            <div className={`text-sm font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
              {tx.type === "credit" ? "+" : "-"}{fmt(tx.amount)}
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block capitalize ${statusStyle(tx.status)}`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}