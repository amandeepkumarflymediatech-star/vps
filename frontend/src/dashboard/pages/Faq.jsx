import { useState } from "react";

const faqData = [
  {
    id: 1,
    question: "How do I book a tutor?",
    answer:
      "Go to the Book Now section, select your subject, preferred tutor, choose a time slot and confirm your booking.",
  },
  {
    id: 2,
    question: "How can I make a payment?",
    answer:
      "Payments can be made using UPI, Debit/Credit Card or Wallet balance from the Payments section.",
  },
  {
    id: 3,
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule a session at least 12 hours before the scheduled time from your dashboard.",
  },
  {
    id: 4,
    question: "How do I become a tutor?",
    answer:
      "Click on the Become Tutor option, fill in your details, upload required documents and submit for approval.",
  },
  {
    id: 5,
    question: "When will I get a refund?",
    answer:
      "Refunds are processed within 3–5 working days if the cancellation is eligible as per our policy.",
  },
];

const Faq = () => {
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-500">
          Find answers to common questions
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search a question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0852A1]"
        />
      </div>

      {/* FAQ LIST */}
      <div className="bg-white rounded-xl shadow divide-y">
        {filteredFaqs.length === 0 && (
          <p className="p-6 text-gray-500 text-center">
            No questions found.
          </p>
        )}

        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="p-5">
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex justify-between items-center text-left"
            >
              <span className="font-medium text-gray-800">
                {faq.question}
              </span>
              <span className="text-xl text-gray-500">
                {openId === faq.id ? "−" : "+"}
              </span>
            </button>

            {openId === faq.id && (
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
