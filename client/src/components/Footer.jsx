import React from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t-2 bg-graph-paper border-black/50 bg-white py-12 px-6 md:px-12 lg:px-20 shrink-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl text-black/75 font-bold uppercase tracking-tight">Lock-In</h2>
          <p className="text-black/60 max-w-xs">
            The ultimate productivity platform for students and professionals to stay focused and achieve their goals.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-zinc-600 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-zinc-600 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-zinc-600 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="hover:text-zinc-600 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Right Sections */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8 lg:gap-10 md:ml-70">
          {/* Platform Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-black/75 uppercase text-sm tracking-wider">Platform</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="/" className="text-black/60 hover:text-black">Home</a></li>
              <li><a href="/leaderboard" className="text-black/60 hover:text-black">Leaderboard</a></li>
              <li><a href="#" className="text-black/60 hover:text-black">Rooms</a></li>
              <li><a href="#" className="text-black/60 hover:text-black">Pomodoro</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-black/75 uppercase text-sm tracking-wider">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://webrtc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/60 hover:text-black"
                >
                  WebRTC Docs
                </a>
              </li>
              <li><a href="#" className="text-black/60 hover:text-black">Documentation</a></li>
              <li><a href="#" className="text-black/60 hover:text-black">Community</a></li>
              <li><a href="#" className="text-black/60 hover:text-black">Support</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-6 pt-6  border-black/10 text-sm text-black/50 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Lock-In. All rights reserved.</span>
        <span>Built with love at Bhopal, India by Mahima.</span>
      </div>
    </footer>
  );
};

export default Footer;