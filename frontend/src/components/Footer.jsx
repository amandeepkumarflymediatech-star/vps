// "use client";

// import Link from "next/link";
// import {
//   FaWhatsapp,
//   FaLinkedin,
//   FaYoutube,
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
// } from "react-icons/fa";

// // Logo import
// import Logo from "../assets/logo/logo.webp";

// const COMPANY_INFO = {
//   name: "Fly Media Tech",
// };

// const Footer = () => {
//   return (


//     <footer className="bg-gray-100 text-black">
//        <hr className="border-gray-100 my-6" />
//       {/* Main Footer Content */}
//       <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        
//         {/* Brand + Description + Social Icons */}
//         <div className="lg:col-span-2">
//           <img
//             src={Logo.src}
//             alt="The English Raj Logo"
//             className="h-14 sm:h-10 lg:h-20 mb-4"
//           />

//           <p className="text-md text-black/80 leading-relaxed max-w-md">
//             The English Raj empowers learners and tutors through personalized
//             English education, flexible schedules, and real-world communication
//             mastery.
//           </p>

//           {/* Social Icons */}
//           <div className="flex gap-4 mt-5 text-xl text-black/70">

//             <a
//               href="https://wa.me/919999999999"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaWhatsapp className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>

//             <a
//               href="https://www.linkedin.com/company/theenglishraj"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaLinkedin className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>

//             <a
//               href="https://www.youtube.com/@theenglishraj"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaYoutube className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>

//             <a
//               href="https://www.facebook.com/theenglishraj"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaFacebook className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>

//             <a
//               href="https://twitter.com/theenglishraj"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaTwitter className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>

//             <a
//               href="https://www.instagram.com/theenglishraj"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <FaInstagram className="hover:text-black hover:scale-110 transition cursor-pointer" />
//             </a>
            
//           </div>
//         </div>

//         {/* Company */}
//         <div>
//           <h4 className="font-bold mb-4 text-lg">Company</h4>
//           <ul className="space-y-2 text-md text-black/80">
//             <li><Link href="/CoursesPricing">Pricing</Link></li>
            
//             <li><Link href="/support">Contact</Link></li>
//           </ul>
//         </div>

//         {/* Support */}
        
//         <div>
//           <h4 className="font-bold mb-4 text-lg">Support</h4>
//           <ul className="space-y-2 text-md text-black/80">
//             <li><Link href="/support">Help & Support</Link></li>
//             <li><Link href="/become-tutor">Become Tutor</Link></li>
//             <li><Link href="/faq">FAQ</Link></li>
//           </ul>
//         </div>

//         {/* Get in Touch */}
//         <div>
//           <h4 className="font-bold mb-4 text-lg">Get in touch</h4>

//           <p className="text-sm text-black/80 mb-1">
//             <strong>Email:</strong> support@theenglishraj.com
//           </p>

//           <p className="text-sm text-black/80">
//             <strong>Phone:</strong> +91 90413-23089
//           </p>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-black/10">
//         <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
//           <p className="text-center md:text-left text-black/70">
//             © {new Date().getFullYear()} The English Raj. All Rights Reserved.
//           </p>
//           <p className="text-black/70">
//                 Design and Developed by{' '}
//                 <a
//                   href="https://flymediatech.com/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-400 hover:text-primary-300 font-semibold transition-colors text-blue-900"
//                 >
//                   Fly Media Technology
//                 </a>
//               </p>
//         </div>
          
//         {/* Legal Links */}
//         {/* <div className="text-center text-xs text-black/60 pb-6">
//           <Link href="/privacy" className="mx-2 hover:underline">Privacy</Link>
//           |
//           <Link href="/terms" className="mx-2 hover:underline">Terms</Link>
//           |
//           <Link href="/cookies" className="mx-2 hover:underline">Cookies</Link>
//         </div> */}
//       </div>



//        {/* Bottom Bar */}
//           {/* <div className="border-t border-gray-800 pt-8 mt-12">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
//               <p className="text-gray-500">
//                 © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
//               </p>
//               <p className="text-gray-500">
//                 Design and Developed by{' '}
//                 <a
//                   href="https://flymediatech.com/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
//                 >
//                   Fly Media Technology
//                 </a>
//               </p>
//             </div>
//           </div> */}

      
//     </footer>
//   );
// };

// export default Footer;



"use client";

import Link from "next/link";
import {
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

import Logo from "../assets/logo/logo.webp";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black w-full">
      <hr className="border-gray-200" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand Section */}
        <div className="lg:col-span-2">
          <img
            src={Logo.src}
            alt="The English Raj Logo"
            className="h-12 sm:h-14 lg:h-20 mb-4"
          />

          <p className="text-sm sm:text-base text-black/80 leading-relaxed max-w-md">
            The English Raj empowers learners and tutors through personalized
            English education, flexible schedules, and real-world communication
            mastery.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-4 mt-5 text-xl text-black/70">
            <a href="https://wa.me/919999999999" target="_blank">
              <FaWhatsapp className="hover:text-black hover:scale-110 transition" />
            </a>
            <a href="https://www.linkedin.com/company/theenglishraj" target="_blank">
              <FaLinkedin className="hover:text-black hover:scale-110 transition" />
            </a>
            <a href="https://www.youtube.com/@theenglishraj" target="_blank">
              <FaYoutube className="hover:text-black hover:scale-110 transition" />
            </a>
            <a href="https://www.facebook.com/theenglishraj" target="_blank">
              <FaFacebook className="hover:text-black hover:scale-110 transition" />
            </a>
            <a href="https://twitter.com/theenglishraj" target="_blank">
              <FaTwitter className="hover:text-black hover:scale-110 transition" />
            </a>
            <a href="https://www.instagram.com/theenglishraj" target="_blank">
              <FaInstagram className="hover:text-black hover:scale-110 transition" />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4 text-base sm:text-lg">Company</h4>
          <ul className="space-y-2 text-sm sm:text-base text-black/80">
            <li><Link href="/CoursesPricing" className="hover:text-black">Pricing</Link></li>
            <li><Link href="/support" className="hover:text-black">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4 text-base sm:text-lg">Support</h4>
          <ul className="space-y-2 text-sm sm:text-base text-black/80">
            <li><Link href="/support" className="hover:text-black">Help & Support</Link></li>
            <li><Link href="/become-tutor" className="hover:text-black">Become Tutor</Link></li>
            <li><Link href="/faq" className="hover:text-black">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-base sm:text-lg">Get in touch</h4>
          <p className="text-sm text-black/80 mb-2">
            <strong>Email:</strong> support@theenglishraj.com
          </p>
          <p className="text-sm text-black/80">
            <strong>Phone:</strong> +91 90413-23089
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row 
                        items-center justify-between gap-3 text-xs sm:text-sm text-black/70">
          
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} The English Raj. All Rights Reserved.
          </p>

          <p className="text-center">
            Design and Developed by{" "}
            <a
              href="https://flymediatech.com/"
              target="_blank"
              className="font-semibold text-blue-900 hover:text-blue-700 transition"
            >
              Fly Media Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

