import { useState } from 'react';
import { Send } from 'lucide-react';
import api from '../../services/api';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await api.post('/contact', form);
      if (!res.ok) throw new Error('Could not send message');
      setForm({ name: '', email: '', subject: '', message: '' });
      setStatus('Message sent successfully.');
    } catch {
      setStatus('Message could not be sent right now.');
    }
  };

  return (
    <section className="py-14 relative z-10 px-6 border-t border-white/5">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">Contact Us</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Need Help With Your Resume?</h2>
          <p className="text-slate-400 mt-4">Send your question to the team. Admin can review every message from the dashboard.</p>
        </div>
        <form className="premium-glass p-6 md:p-8 contact-form" onSubmit={handleSubmit}>
          <div className="contact-grid">
            <input className="form-input" placeholder="Your name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
            <input className="form-input" type="email" placeholder="Email address" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
          </div>
          <input className="form-input" placeholder="Subject" value={form.subject} onChange={(e) => updateField('subject', e.target.value)} />
          <textarea className="form-input form-textarea" rows="5" placeholder="Write your message..." value={form.message} onChange={(e) => updateField('message', e.target.value)} required />
          <div className="contact-submit-row">
            <button className="px-6 py-3 rounded-2xl font-bold premium-btn-primary flex items-center gap-2" type="submit">
              <Send className="w-4 h-4" /> Send Message
            </button>
            {status && <span>{status}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
