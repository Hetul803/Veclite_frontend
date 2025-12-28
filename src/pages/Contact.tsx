import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../lib/auth-context';

export function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send email using mailto link (simple approach)
      // In production, you'd want to use a backend API or email service
      const mailtoLink = `mailto:patelhetul803@gmail.com?subject=${encodeURIComponent(`[Veclite Contact] ${subject}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoLink;
      
      // Also log to console for debugging
      console.log('Contact form submission:', { name, email, subject, message });
      
      // Show success message
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setName(user?.email?.split('@')[0] || '');
        setEmail(user?.email || '');
        setSubject('');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Failed to send message. Please email patelhetul803@gmail.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={24} className="text-cyan-400" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">Message Sent!</h3>
                  <p className="text-slate-400">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      rows={8}
                      placeholder="Tell us what's on your mind..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Send size={16} className="mr-2 animate-pulse" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-slate-500 text-center">
                    By submitting this form, you'll open your email client to send us a message.
                    <br />
                    Or email us directly at:{' '}
                    <a
                      href="mailto:patelhetul803@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      patelhetul803@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Email Support</h3>
                    <p className="text-slate-400 text-sm mb-3">
                      For technical support, billing questions, or general inquiries.
                    </p>
                    <a
                      href="mailto:patelhetul803@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    >
                      patelhetul803@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">Response Time</h3>
                    <p className="text-slate-400 text-sm mb-3">
                      We typically respond within 24-48 hours during business days.
                    </p>
                    <p className="text-slate-500 text-xs">
                      For urgent issues, please mention "URGENT" in your subject line.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

