import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0852A1] rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-black text-gray-800 tracking-tight">ENGLISH RAJ</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering students worldwide with world-class English language education and professional communication skills.
            </p>
          </div>

          {/* Quick Links Group */}
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Learning</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">All Courses</li>
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">Live Sessions</li>
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">Study Material</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-[#0852A1] cursor-pointer transition-colors">Community</li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Stay Connected</h4>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="p-2 bg-gray-50 text-gray-400 hover:bg-[#0852A1] hover:text-white rounded-xl transition-all shadow-sm">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <Mail size={16} className="text-[#0852A1]" />
                <span>support@englishraj.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} The English Raj. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={14} className="text-red-400 fill-current" /> for learners
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;