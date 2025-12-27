import { useState } from "react";

const Payments = () => {
  const [balance] = useState(2499);

  const transactions = [
    {
      id: 1,
      date: "2025-01-10",
      description: "Tutor Booking – Maths",
      amount: "-₹500",
      status: "Success",
    },
    {
      id: 2,
      date: "2025-01-05",
      description: "Wallet Recharge",
      amount: "+₹1000",
      status: "Success",
    },
    {
      id: 3,
      date: "2024-12-28",
      description: "Tutor Booking – English",
      amount: "-₹700",
      status: "Pending",
    },
  ];

  const statusStyle = (status) => {
    if (status === "Success")
      return "bg-green-100 text-green-700";
    if (status === "Pending")
      return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="text-sm text-gray-500">
          Manage your wallet & payment history
        </p>
      </div>

      {/* WALLET */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#0852A1] to-blue-500 text-white rounded-xl p-6 shadow">
          <p className="text-sm">Wallet Balance</p>
          <h2 className="text-3xl font-bold mt-2">₹{balance}</h2>
          <button className="mt-4 bg-white text-[#0852A1] px-4 py-2 rounded-lg text-sm">
            Add Money
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Payment Method</p>
          <h3 className="font-semibold mt-2">UPI</h3>
          <p className="text-sm text-gray-400">amandeep@upi</p>
          <button className="mt-4 text-sm text-blue-600">
            Change Method
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Last Payment</p>
          <h3 className="font-semibold mt-2">₹500</h3>
          <p className="text-sm text-gray-400">10 Jan 2025</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Successful
          </span>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Transaction History</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t">
                <td className="p-3">{txn.date}</td>
                <td className="p-3">{txn.description}</td>
                <td
                  className={`p-3 font-medium ${
                    txn.amount.startsWith("-")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {txn.amount}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                      txn.status
                    )}`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
