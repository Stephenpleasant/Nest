export const BANKS = [
    "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank",
    "First Bank of Nigeria", "First City Monument Bank (FCMB)", "Globus Bank",
    "Guaranty Trust Bank (GTB)", "Heritage Bank", "Keystone Bank", "Opay",
    "Palmpay", "Polaris Bank", "Providus Bank", "Stanbic IBTC Bank",
    "Standard Chartered Bank", "Sterling Bank", "SunTrust Bank", "Union Bank",
    "United Bank for Africa (UBA)", "Unity Bank", "Wema Bank", "Zenith Bank",
  ];
  
  export const MOCK_TRANSACTIONS = [
    { id: 1, type: "credit", label: "Commission – 45 Bourdillon Road",    amount: 250000, date: "Feb 28, 2026", status: "completed" },
    { id: 2, type: "debit",  label: "Withdrawal to GTB ****4521",         amount: 100000, date: "Feb 22, 2026", status: "completed" },
    { id: 3, type: "credit", label: "Commission – Lekki Phase 1 Duplex",  amount: 180000, date: "Feb 15, 2026", status: "completed" },
    { id: 4, type: "credit", label: "Agency Fee – 3BR Flat Ikeja",        amount:  75000, date: "Feb 10, 2026", status: "completed" },
    { id: 5, type: "debit",  label: "Withdrawal to Zenith ****8830",      amount:  50000, date: "Jan 30, 2026", status: "completed" },
    { id: 6, type: "credit", label: "Commission – VI Penthouse",          amount: 420000, date: "Jan 18, 2026", status: "completed" },
  ];
  
  export const fmt = (n) =>
    "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2 });