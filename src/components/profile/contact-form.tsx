'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/contact-actions';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormProps {
    profileId: string;
    profileName: string;
}

export function ContactForm({ profileId, profileName }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const result = await submitContactForm(profileId, formData);

        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            // Reset after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Something went wrong');
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex flex-col items-center text-center gap-3">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-white/70">
                        Thank you for reaching out. {profileName} will get back to you soon.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    Get in Touch
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm text-white/80 mb-1.5">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="contact-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            maxLength={100}
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                transition-all duration-200
              "
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-email" className="block text-sm text-white/80 mb-1.5">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="contact-email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                transition-all duration-200
              "
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-message" className="block text-sm text-white/80 mb-1.5">
                            Message
                        </label>
                        <textarea
                            id="contact-message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            minLength={10}
                            maxLength={2000}
                            rows={4}
                            className="
                w-full px-4 py-2.5 rounded-lg
                bg-white/10 border border-white/20
                text-white placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                transition-all duration-200
                resize-none
              "
                            placeholder="Your message..."
                        />
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="
              w-full py-3 px-4 rounded-lg
              bg-gradient-to-r from-purple-600 to-pink-600
              text-white font-medium
              flex items-center justify-center gap-2
              hover:from-purple-700 hover:to-pink-700
              focus:outline-none focus:ring-2 focus:ring-purple-500/50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-lg hover:shadow-xl
            "
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
