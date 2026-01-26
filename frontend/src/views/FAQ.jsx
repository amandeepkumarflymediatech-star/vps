"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const faqData = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "How do I register for classes?",
                a: "Click on the 'Register' button in the top navigation, fill in your details, verify your email via OTP, and you're all set! You can then browse tutors and book your first session.",
            },
            {
                q: "What are the available learning packages?",
                a: "We offer flexible packages ranging from 8 to 16 lessons. Each package includes one-on-one sessions with expert tutors, personalized feedback, and progress tracking. Check our pricing page for detailed information.",
            },
            {
                q: "Can I choose my own tutor?",
                a: "Absolutely! You can browse through our verified tutors, view their profiles, experience, and available time slots, then book sessions with the tutor that best fits your learning style.",
            },
        ],
    },
    {
        category: "Payment & Pricing",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept UPI payments for Indian students and PayPal for international students. All transactions are secure and encrypted.",
            },
            {
                q: "Is there a refund policy?",
                a: "Yes, you can cancel a session up to 2 hours before the scheduled time for a full refund. Cancellations made within 2 hours are non-refundable.",
            },
            {
                q: "Are there any hidden charges?",
                a: "No hidden charges! The price you see on the package is the final price. We believe in complete transparency.",
            },
            {
                q: "Do you offer discounts for bulk packages?",
                a: "Yes, larger packages (12+ lessons) come with discounted rates. Check our pricing page for current offers.",
            },
        ],
    },
    {
        category: "Classes & Sessions",
        questions: [
            {
                q: "How long is each session?",
                a: "Each session is typically 45-60 minutes, depending on the package you choose. This duration is optimal for focused learning without fatigue.",
            },
            {
                q: "What if I miss a scheduled class?",
                a: "If you miss a class without prior cancellation, it will be marked as 'Missed' and cannot be rescheduled. We recommend canceling at least 2 hours in advance.",
            },
            {
                q: "Can I reschedule a session?",
                a: "Yes, you can cancel and rebook a session up to 2 hours before the scheduled time. Simply go to 'My Sessions' and select a new time slot.",
            },
            {
                q: "Are classes conducted live?",
                a: "Yes, all classes are live one-on-one sessions via video call. You'll receive a meeting link before each session.",
            },
        ],
    },
    {
        category: "Learning & Progress",
        questions: [
            {
                q: "How do I track my progress?",
                a: "Your student dashboard shows completed sessions, upcoming classes, and feedback from tutors. You can also see your improvement over time.",
            },
            {
                q: "Will I receive study materials?",
                a: "Yes, tutors provide customized study materials, practice exercises, and resources based on your learning goals and current level.",
            },
            {
                q: "Can I prepare for IELTS/CAT/SSC exams?",
                a: "Absolutely! We have specialized tutors for IELTS, CAT, SSC, and other competitive exams. Select your goal during registration.",
            },
            {
                q: "How soon will I see improvement?",
                a: "Most students notice improvement in confidence and fluency within 4-6 sessions. Consistent practice and engagement accelerate results.",
            },
        ],
    },
    {
        category: "Technical Support",
        questions: [
            {
                q: "What if I face technical issues during a session?",
                a: "Contact support immediately via WhatsApp or email. If the issue persists for more than 10 minutes, the session will be rescheduled at no extra cost.",
            },
            {
                q: "What are the system requirements?",
                a: "You need a stable internet connection (minimum 2 Mbps), a device with camera and microphone (laptop/tablet/smartphone), and a modern web browser.",
            },
            {
                q: "Can I access classes on mobile?",
                a: "Yes, our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktops.",
            },
        ],
    },
    {
        category: "Account & Security",
        questions: [
            {
                q: "How do I reset my password?",
                a: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the OTP verification process to set a new password.",
            },
            {
                q: "Is my personal information secure?",
                a: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your information with third parties.",
            },
            {
                q: "Can I update my profile information?",
                a: "Yes, go to your dashboard and click on 'Profile' to update your name, phone number, and other details.",
            },
        ],
    },
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleAccordion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setActiveIndex(activeIndex === key ? null : key);
    };

    const filteredFAQ = faqData.map((category) => ({
        ...category,
        questions: category.questions.filter(
            (item) =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((category) => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#0852A1] to-indigo-700 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="p-4 bg-white/10 rounded-full">
                            <HelpCircle size={48} />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Find answers to common questions about The English Raj
                    </motion.p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* SEARCH BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="relative">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0852A1] focus:border-transparent transition shadow-sm text-black font-medium"
                        />
                    </div>
                </motion.div>

                {/* FAQ CATEGORIES */}
                {filteredFAQ.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No questions found matching your search.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredFAQ.map((category, categoryIndex) => (
                            <motion.div
                                key={categoryIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: categoryIndex * 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-[#0852A1] rounded-full"></span>
                                    {category.category}
                                </h2>

                                <div className="space-y-3">
                                    {category.questions.map((item, questionIndex) => {
                                        const key = `${categoryIndex}-${questionIndex}`;
                                        const isActive = activeIndex === key;

                                        return (
                                            <div
                                                key={questionIndex}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                                            >
                                                <button
                                                    onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                                                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
                                                >
                                                    <span className="font-semibold text-gray-800 pr-4">
                                                        {item.q}
                                                    </span>
                                                    <ChevronDown
                                                        className={`text-[#0852A1] transition-transform flex-shrink-0 ${isActive ? "rotate-180" : ""
                                                            }`}
                                                        size={20}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                                                {item.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* STILL HAVE QUESTIONS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 bg-gradient-to-r from-[#0852A1] to-indigo-700 text-white rounded-2xl p-8 text-center"
                >
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-blue-100 mb-6">
                        Our support team is here to help you with any queries.
                    </p>
                    <a
                        href="/support"
                        className="inline-block bg-white text-[#0852A1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
