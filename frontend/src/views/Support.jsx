"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { submitSupportRequest } from "../api/support.api";

const Support = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await submitSupportRequest(formData);
            toast.success("Support request submitted successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#0852A1] to-indigo-700 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        We're Here to Help
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto"
                    >
                        Have questions or need assistance? Our support team is ready to help you succeed in your English learning journey.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* CONTACT INFO CARDS */}
                    <div className="lg:col-span-1 space-y-27">
                        {/* Email Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Mail className="text-[#0852A1]" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Email Us</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                                Send us an email anytime
                            </p>
                            <a
                                href="mailto:support@theenglishraj.com"
                                className="text-[#0852A1] font-semibold hover:underline"
                            >
                                support@theenglishraj.com
                            </a>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Phone className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Call Us</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                                Mon-Sat, 9 AM - 8 PM IST
                            </p>
                            <a
                                href="tel:+919876543210"
                                className="text-[#0852A1] font-semibold hover:underline"
                            >
                                +91 90413-23089
                            </a>
                        </motion.div>

                        {/* WhatsApp Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <MessageCircle className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">WhatsApp</h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                                Quick support via WhatsApp
                            </p>
                            <a
                                href="https://api.whatsapp.com/send/?phone=919041323089&text=Hello%21+I+need+help+with+The+English+Raj+courses.&type=phone_number&app_absent=0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0852A1] font-semibold hover:underline"
                            >
                                Chat with us
                            </a>
                        </motion.div>
                    </div>

                    {/* CONTACT FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Send Us a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0852A1] focus:border-transparent transition text-black font-medium"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0852A1] focus:border-transparent transition text-black font-medium"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this regarding?"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0852A1] focus:border-transparent transition text-black font-medium"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Tell us how we can help you..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0852A1] focus:border-transparent transition resize-none text-black font-medium"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0852A1] text-white py-3 rounded-lg font-semibold hover:bg-[#387DC6] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Support;
