import { useState } from "react";
import BalanceCard from "./BalanceCard";
import TransactionList from "./TransactionList";
import WithdrawModal from "./WithdrawModal";
import { MOCK_TRANSACTIONS } from "./data";

export default function WalletPage() {
  const [balance] = useState(775000); // ← Replace with API fetch
  const [showBalance, setShowBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const totalEarned = MOCK_TRANSACTIONS
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);

  const totalWithdrawn = MOCK_TRANSACTIONS
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-8 min-h-screen bg-gray-50 font-sans">
      {/* Page title */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-[#0b1a2e] m-0">Wallet</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your earnings and withdrawals</p>
      </div>

      {/* Side-by-side layout */}
      <div className="flex gap-6 items-start">
        {/* Left column — balance card */}
        <div className="w-[420px] flex-shrink-0">
          <BalanceCard
            balance={balance}
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance((p) => !p)}
            onWithdraw={() => setShowModal(true)}
            totalEarned={totalEarned}
            totalWithdrawn={totalWithdrawn}
          />
        </div>

        {/* Right column — transaction history */}
        <div className="flex-1 min-w-0">
          <TransactionList transactions={MOCK_TRANSACTIONS} />
        </div>
      </div>

      {showModal && (
        <WithdrawModal balance={balance} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}