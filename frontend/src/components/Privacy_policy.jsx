import React from 'react';

const Privacy_policy = () => {
    return (
        <section className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 bg-white shadow-sm rounded-2xl p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0852A1] mb-8 border-b-2 border-[#0852A1]/20 pb-4">
                    Privacy Policy
                </h1>

                <div className="space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Information We Collect
                        </h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>
                                <strong className="text-gray-900">Personal Information:</strong> We collect personal details such as your name, email address, shipping address, phone number, and payment information when you make a purchase, create an account, or contact us.
                            </li>
                            <li>
                                <strong className="text-gray-900">Non-Personal Information:</strong> We may collect non-personal data such as browser type, operating system, and browsing behavior to improve our website and services.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>
                                <strong className="text-gray-900">To Process Orders:</strong> We use your personal information to process and fulfill your orders.
                            </li>
                            <li>
                                <strong className="text-gray-900">To Communicate:</strong> We use your contact information to send you updates about your order, respond to inquiries, and send promotional materials if you have opted in.
                            </li>
                            <li>
                                <strong className="text-gray-900">To Improve Our Services:</strong> We analyze non-personal information to understand user behavior and enhance our website’s performance.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Information Sharing
                        </h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>
                                <strong className="text-gray-900">Third-Party Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our website, processing payments, and delivering orders.
                            </li>
                            <li>
                                <strong className="text-gray-900">Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Data Security
                        </h2>
                        <p className="pl-5">
                            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Your Rights
                        </h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>
                                <strong className="text-gray-900">Access and Correction:</strong> You have the right to access and correct your personal information. You can update your account details through our website.
                            </li>
                            <li>
                                <strong className="text-gray-900">Opt-Out:</strong> You can opt-out of receiving promotional emails by following the unsubscribe instructions in the emails.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Changes to This Policy
                        </h2>
                        <p className="pl-5">
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised date will be indicated at the top of the policy.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default Privacy_policy;
