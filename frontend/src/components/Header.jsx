import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Logo from "../assets/logo/logo.webp";



const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-25 flex items-center justify-between">
        
         {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="EnglishYaari Logo"
                className="h-15 sm:h-10 lg:h-20 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-lg font-medium text-gray-800">
          <Link to="/" className="text-[#0852A1] font-semibold">
            Home
          </Link>
          <Link to="/tutors" className="hover:text-[#0852A1]">
            Meet your tutor
          </Link>
          <Link to="/organizations" className="hover:text-[#0852A1]">
            For Organizations
          </Link>
          <Link to="/become-tutor" className="hover:text-[#0852A1]">
            Become a tutor
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/register"
            className="bg-[#0852A1] text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="border border-[#0852A1] text-[#0852A1] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#0852A1] hover:text-white transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-2xl text-gray-800"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <nav className="flex flex-col px-6 py-5 space-y-4 text-sm font-medium">
            <Link onClick={() => setOpen(false)} to="/" className="text-[#0852A1]">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} to="/tutors">
              Meet your tutor
            </Link>
            <Link onClick={() => setOpen(false)} to="/organizations">
              For Organizations
            </Link>
            <Link onClick={() => setOpen(false)} to="/become-tutor">
              Become a tutor
            </Link>

            <div className="pt-4 border-t flex flex-col gap-3">
              <Link
                onClick={() => setOpen(false)}
                to="/register"
                className="bg-[#0852A1] text-white text-center py-2 rounded-full"
              >
                Register
              </Link>
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="border border-[#0852A1] text-[#0852A1] text-center py-2 rounded-full"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;


