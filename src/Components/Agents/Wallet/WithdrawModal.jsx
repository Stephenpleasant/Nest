import { useState, useEffect } from "react";
import { CloseIcon, CheckIcon } from "./Icons";
import { Field } from "./Field";
import { BANKS, fmt } from "./data";

export default function WithdrawModal({ balance, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ bank: "", accountNumber: "", accountName: "", amount: "" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  useEffect(() => {
    if (form.accountNumber.length === 10 && form.bank) {
      setTimeout(() => set("accountName", "JANE DOE"), 600);
    } else {
      set("accountName", "");
    }
  }, [form.accountNumber, form.bank]);

  const validate = () => {
    const e = {};
    if (!form.bank) e.bank = "Select a bank";
    if (!/^\d{10}$/.test(form.accountNumber)) e.accountNumber = "Enter a valid 10-digit account number";
    if (!form.amount || Number(form.amount) < 1000) e.amount = "Minimum withdrawal is ₦1,000";
    if (Number(form.amount) > balance) e.amount = "Amount exceeds available balance";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => { if (validate()) setStep(2); };
  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 2000);
  };

  const inputCls = (err) =>
    `w-full h-11 rounded-xl text-sm outline-none transition px-3.5 bg-white border ${
      err ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
    } text-gray-900`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1a2e]/55 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

        {/* Header */}
        {step !== 3 && (
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <div>
              <div className="text-base font-bold text-[#0b1a2e]">
                {step === 1 ? "Withdraw Funds" : "Confirm Withdrawal"}
              </div>
              {step === 1 && (
                <div className="text-xs text-gray-400 mt-0.5">Available: {fmt(balance)}</div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-gray-100 grid place-items-center text-gray-500 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="px-7 py-6">
          {/* ── Step 1: Form ── */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              {/* Bank */}
              <Field label="Bank" error={errors.bank}>
                <div className="relative">
                  <select
                    value={form.bank}
                    onChange={(e) => set("bank", e.target.value)}
                    className={inputCls(!!errors.bank) + " appearance-none cursor-pointer pr-8"}
                  >
                    <option value="">Select your bank</option>
                    {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                </div>
              </Field>

              {/* Account Number */}
              <Field label="Account Number" error={errors.accountNumber}>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-digit account number"
                  value={form.accountNumber}
                  onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))}
                  className={inputCls(!!errors.accountNumber)}
                />
                {form.accountName && (
                  <div className="mt-1.5 text-xs font-semibold text-green-600 tracking-wide">
                    ✓ {form.accountName}
                  </div>
                )}
              </Field>

              {/* Amount */}
              <Field label="Amount (₦)" error={errors.amount}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">₦</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className={inputCls(!!errors.amount) + " pl-8"}
                  />
                </div>
                {/* Quick amounts */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10000, 50000, 100000, 200000]
                    .filter((v) => v <= balance)
                    .map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => set("amount", String(v))}
                        className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          Number(form.amount) === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {fmt(v)}
                      </button>
                    ))}
                </div>
              </Field>

              <button
                onClick={handleSubmit}
                className="w-full h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          )}

          {/* ── Step 2: Confirm ── */}
          {step === 2 && (
            <div className="flex flex-col">
              <div className="bg-blue-50 rounded-xl p-5 mb-5 border border-blue-100">
                {[
                  ["Bank", form.bank],
                  ["Account Number", form.accountNumber],
                  ["Account Name", form.accountName || "—"],
                  ["Amount", fmt(form.amount)],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2.5 border-b border-blue-100 last:border-0"
                  >
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-[#0b1a2e]">{val}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                Please review the details above carefully. This withdrawal cannot be reversed once processed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold border-0 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 disabled:opacity-80 transition-opacity"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      Processing…
                    </span>
                  ) : "Confirm Withdrawal"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="text-center py-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-400 grid place-items-center mx-auto mb-5 text-white shadow-lg shadow-green-600/30">
                <CheckIcon />
              </div>
              <div className="text-xl font-bold text-[#0b1a2e] mb-2">Withdrawal Initiated!</div>
              <div className="text-sm text-gray-500 leading-relaxed mb-2">
                <strong className="text-[#0b1a2e]">{fmt(form.amount)}</strong> will be credited to your{" "}
                {form.bank} account within{" "}
                <strong className="text-[#0b1a2e]">1–3 business days</strong>.
              </div>
              <div className="text-xs text-gray-400 mb-7">Account: {form.accountNumber}</div>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}