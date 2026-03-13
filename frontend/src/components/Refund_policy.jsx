import React from 'react';

const Refund_policy = () => {
    return (
        <section className="py-16 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 bg-white shadow-sm rounded-2xl p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0852A1] mb-8 border-b-2 border-[#0852A1]/20 pb-4">
                    Refund Policy
                </h1>

                <div className="space-y-10 text-gray-700 leading-relaxed text-sm md:text-base">
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Overview
                        </h2>
                        <p className="pl-5">
                            We strive to provide high-quality services and ensure customer satisfaction. However, due to the nature of our offerings, we adhere to a strict no-refund policy as outlined below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            No Refunds
                        </h2>
                        <p className="pl-5">
                            Once a service is purchased or a transaction is completed on our platform, it is considered final and non-refundable. This policy applies to all services and digital products offered through our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-[#0852A1] rounded-full mr-3"></span>
                            Exceptions
                        </h2>
                        <p className="pl-5 italic bg-amber-50 p-4 border-l-4 border-amber-400 rounded-r-lg">
                            Incase of any payment failure from our side or any technical glitch, we will refund the amount after inspection. If any refund is approved, the amount will be credited back to the Original Payment Account within 7-14 Business Days.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default Refund_policy;
