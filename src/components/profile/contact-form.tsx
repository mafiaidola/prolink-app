'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/contact-actions';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ContactFormSettings } from '@/lib/types';

interface ContactFormProps {
    profileId: string;
    profileName: string;
    settings?: ContactFormSettings;
}

export function ContactForm({ profileId, profileName, settings = {} }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        company: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Configuration with defaults
    const title = settings.title || 'Get in Touch';
    const description = settings.description;
    const buttonText = settings.buttonText || 'Send Message';
    const successMessage = settings.successMessage || `Thank you for reaching out. ${profileName} will get back to you soon.`;

    // Optional fields
    const showPhone = settings.fields?.phone || false;
    const showSubject = settings.fields?.subject || false;
    const showCompany = settings.fields?.company || false;

    // Placeholders
    const placeholders = {
        name: settings.placeholders?.name || 'John Doe',
        email: settings.placeholders?.email || 'john@example.com',
        phone: settings.placeholders?.phone || '+1 (555) 123-4567',
        subject: settings.placeholders?.subject || 'How can we help?',
        company: settings.placeholders?.company || 'Acme Inc.',
        message: settings.placeholders?.message || 'Your message...',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const result = await submitContactForm(profileId, {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            phone: showPhone ? formData.phone : undefined,
            subject: showSubject ? formData.subject : undefined,
            company: showCompany ? formData.company : undefined,
        });

        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', company: '', message: '' });
            // Reset after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Something went wrong');
        }
    };

    const inputClass = `
        w-full px-4 py-2.5 rounded-lg
        bg-white/10 border border-white/20
        text-white placeholder-white/40
        focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
        transition-all duration-200
    `;

    if (status === 'success') {
        return (
            <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex flex-col items-center text-center gap-3">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-white/70">{successMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                    {title}
                </h3>
                {description && (
                    <p className="text-white/60 text-sm text-center mb-4">{description}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field - Always shown */}
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
                            className={inputClass}
                            placeholder={placeholders.name}
                        />
                    </div>

                    {/* Email Field - Always shown */}
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
                            className={inputClass}
                            placeholder={placeholders.email}
                        />
                    </div>

                    {/* Phone Field - Optional */}
                    {showPhone && (
                        <div>
                            <label htmlFor="contact-phone" className="block text-sm text-white/80 mb-1.5">
                                Phone Number <span className="text-white/40">(optional)</span>
                            </label>
                            <input
                                type="tel"
                                id="contact-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                maxLength={30}
                                className={inputClass}
                                placeholder={placeholders.phone}
                            />
                        </div>
                    )}

                    {/* Company Field - Optional */}
                    {showCompany && (
                        <div>
                            <label htmlFor="contact-company" className="block text-sm text-white/80 mb-1.5">
                                Company <span className="text-white/40">(optional)</span>
                            </label>
                            <input
                                type="text"
                                id="contact-company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                maxLength={100}
                                className={inputClass}
                                placeholder={placeholders.company}
                            />
                        </div>
                    )}

                    {/* Subject Field - Optional */}
                    {showSubject && (
                        <div>
                            <label htmlFor="contact-subject" className="block text-sm text-white/80 mb-1.5">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="contact-subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                maxLength={200}
                                className={inputClass}
                                placeholder={placeholders.subject}
                            />
                        </div>
                    )}

                    {/* Message Field - Always shown */}
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
                            className={`${inputClass} resize-none`}
                            placeholder={placeholders.message}
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
                                {buttonText}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
