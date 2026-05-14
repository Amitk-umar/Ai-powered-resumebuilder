import { Link } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="premium-footer py-16 relative z-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

        <div className="flex flex-col gap-4">
          <span className="text-xl font-bold footer-title flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" /> NextHire<span className="gradient-text bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </span>
          <p className="text-xs footer-text leading-relaxed">World-class AI-powered career coach and optimization tool mapping job-seekers to elite positions worldwide.</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider footer-title">Platform</span>
          <Link to="/" className="text-xs footer-link transition-colors">Features</Link>
          <Link to="/builder" className="text-xs footer-link transition-colors">Resume Builder</Link>
          <Link to="/screener" className="text-xs footer-link transition-colors">AI Screener</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider footer-title">Company</span>
          <Link to="/" className="text-xs footer-link transition-colors">About Us</Link>
          <Link to="/" className="text-xs footer-link transition-colors">Career Blog</Link>
          <Link to="/" className="text-xs footer-link transition-colors">Privacy Policy</Link>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-wider footer-title">Newsletter</span>
          <p className="text-xs footer-text">Receive expert optimization tips directly inside your inbox weekly.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email..." className="px-3.5 py-2.5 rounded-xl text-xs footer-input focus:border-purple-400 w-full" />
            <button className="p-2.5 bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center text-white"><Send className="w-4 h-4" /></button>
          </div>
        </div>

      </div>
      <div className="container mx-auto px-6 border-t border-white/5 pt-8 text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-4" style={{ marginTop: '2.5rem' }}>
        <span className="footer-text">© 2026 NextHireAI. All rights reserved. Made with ❤️ for ambitious professionals.</span>
        <div className="flex gap-4">
          <Link to="/" className="footer-link transition-colors">Privacy Policy</Link>
          <Link to="/" className="footer-link transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
