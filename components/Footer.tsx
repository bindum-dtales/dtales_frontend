import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";


const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/dtales-logo.png" 
                alt="DTALES Tech Logo" 
                className="h-14 w-auto"
              />
            </Link>

            <p className="text-gray-400 max-w-md text-lg">
              Technical Storytelling. Reimagined
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Work</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Connect</h4>
            <div className="flex gap-4 mb-8">
              <a 
                href="https://www.linkedin.com/company/dtales-tech/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="mailto:contact@dtales.tech" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
              <p className="text-gray-400 text-sm">
                <a href="mailto:contact@dtales.tech" className="hover:text-white transition-colors">
                  Mail: contact@dtales.tech
                </a>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 text-gray-500 text-sm flex justify-between">
          <p>© {new Date().getFullYear()} DTALES Tech. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;