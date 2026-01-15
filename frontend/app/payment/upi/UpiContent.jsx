// "use client"; // Move logic here

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function UpiContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const amount = searchParams.get("amount") || "1";
//   const plan = searchParams.get("plan") || "Session Activation";
//   const tutorId = searchParams.get("tutorId");

//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
//   }, []);

//   const upiId = "nshpental-1@okaxis";
//   const merchantName = "The English Raj";
//   const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(plan)}`;

//   const handleUpiPay = () => {
//     if (!isMobile) {
//        alert("Scan the QR code using your mobile UPI app.");
//        return;
//     }
//     window.location.href = upiUrl;
//     router.push(`/payment/success?tutorId=${tutorId}&amount=${amount}&status=pending`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
//         <h1 className="text-xl font-bold">Scan & Pay</h1>
//         <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{amount}</p>
//         <div className="mt-6 flex justify-center">
//           <Image src="/upi-qr.png" width={220} height={220} alt="UPI QR" priority />
//         </div>
//         <button onClick={handleUpiPay} className="mt-6 w-full bg-[#0852A1] text-white py-3 rounded-full font-semibold">
//           Pay via UPI App
//         </button>
//       </motion.div>
//     </div>
//   );
// }



// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function UpiContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const lessons = searchParams?.get("lessons");
//   const price = searchParams?.get("price"); // directly get price from query
//   const tutorId = searchParams?.get("tutorId");

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
//   }, []);

//   const upiId = "nshpental-1@okaxis";
//   const merchantName = "The English Raj";

//   const upiUrl = price
//     ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
//         merchantName
//       )}&am=${price}&cu=INR&tn=${encodeURIComponent(
//         `${lessons} Lessons Package`
//       )}`
//     : "";

//   const handleUpiPay = () => {
//     if (!isMobile) {
//       alert("Scan the QR code using your mobile UPI app.");
//       return;
//     }
//     if (!upiUrl) return;

//     window.location.href = upiUrl;

//     router.push(
//       `/payment/success?tutorId=${tutorId}&amount=${price}&status=pending`
//     );
//   };

//   if (!lessons || !price) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Lesson plan or price missing!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
//       >
//         <h1 className="text-xl font-bold">Scan & Pay</h1>
//         <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{price}</p>
//         <div className="mt-6 flex justify-center">
//           <Image
//             src="/upi-qr.png"
//             width={220}
//             height={220}
//             alt="UPI QR"
//             priority
//           />
//         </div>
//         <button
//           onClick={handleUpiPay}
//           className="mt-6 w-full bg-[#0852A1] text-white py-3 rounded-full font-semibold"
//         >
//           Pay via UPI App
//         </button>
//       </motion.div>
//     </div>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function UpiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams?.get("amount"); // from CoursesPricing
  const lessons = searchParams?.get("lessons");
  const tutorId = searchParams?.get("tutorId");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));

    if (!amount || !lessons) {
      alert("Lesson plan or amount missing!");
      router.push("/courses-pricing"); // fallback
    }
  }, [amount, lessons, router]);

  const upiId = "nshpental-1@okaxis";
  const merchantName = "The English Raj";
  const planName = `${lessons} Lessons Package`;

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(planName)}`;

  const handleUpiPay = () => {
    if (!isMobile) {
      alert("Scan the QR code using your mobile UPI app.");
      return;
    }
    window.location.href = upiUrl;

    router.push(
      `/payment/success?tutorId=${tutorId || ""}&amount=${amount}&status=pending`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full"
      >
        <h1 className="text-xl font-bold">Scan & Pay</h1>
        <p className="mt-2 text-lg font-bold text-[#0852A1]">₹{amount}</p>
        <p className="text-sm text-gray-600 mt-1">{planName}</p>
        <div className="mt-6 flex justify-center">
          <Image
            src="/upi-qr.png"
            width={220}
            height={220}
            alt="UPI QR"
            priority
          />
        </div>
        <button
          onClick={handleUpiPay}
          className="mt-6 w-full bg-[#0852A1] text-white py-3 rounded-full font-semibold"
        >
          Pay via UPI App
        </button>
      </motion.div>
    </div>
  );
}
