import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

// Logo import
import Logo from "../assets/logo/logo.webp";

const Footer = () => {
  return (
    <footer className="bg-[#F8F3F3] text-black">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand + Description + Social Icons */}
        <div className="lg:col-span-2">
         <img
  src={Logo}
  alt="The English Raj Logo"
  className="h-15 sm:h-10 lg:h-20 mb-4"

/>

          <p className="text-md text-black/80 leading-relaxed max-w-md">
            The English Raj empowers learners and tutors through personalized
            English education, flexible schedules, and real-world communication
            mastery.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5 text-xl text-black/70">
            <FaWhatsapp className="hover:text-black cursor-pointer" />
            <FaLinkedin className="hover:text-black cursor-pointer" />
            <FaYoutube className="hover:text-black cursor-pointer" />
            <FaFacebook className="hover:text-black cursor-pointer" />
            <FaTwitter className="hover:text-black cursor-pointer" />
            <FaInstagram className="hover:text-black cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold mb-4 text-lg">Company</h4>
          <ul className="space-y-2 text-md text-black/80">
            <li><Link to="/">Goal</Link></li>
            <li><Link to="/">Pricing</Link></li>
            <li><Link to="/">Review</Link></li>
            <li><Link to="/">Book a Session</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-4 text-lg">Support</h4>
          <ul className="space-y-2 text-md text-black/80">
            <li><Link to="/">Help & Support</Link></li>
            <li><Link to="/">Become Instructor</Link></li>
            <li><Link to="/">Get the App</Link></li>
            <li><Link to="/">FAQ</Link></li>
            <li><Link to="/">Tutorial</Link></li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="font-bold mb-4 text-lg">Get in touch</h4>

          <p className="text-md text-black/80 leading-relaxed mb-3">
            339 McDermott Points <br />
            Hettingerhaven, NV 15283
          </p>

          <p className="text-sm text-black/80 mb-1">
            <strong>Email:</strong> support@geeksui.com
          </p>

          <p className="text-sm text-black/80">
            <strong>Phone:</strong> (000) 123 456 789
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-center md:text-left text-black/70">
            Copyright © {new Date().getFullYear()} englishraj.
            All Rights Reserved.
          </p>
        </div>

        {/* Legal Links */}
        <div className="text-center text-xs text-black/60 pb-6">
          <Link to="/" className="mx-2 hover:underline">Privacy</Link>
          |
          <Link to="/" className="mx-2 hover:underline">Terms</Link>
          |
          <Link to="/" className="mx-2 hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
