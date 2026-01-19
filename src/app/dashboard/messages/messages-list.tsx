'use client';

import { useState } from 'react';
import { ContactSubmission } from '@/lib/types';
import { markSubmissionAsRead, markSubmissionAsUnread, deleteSubmission } from '@/lib/contact-actions';
import {
    Mail, MailOpen, Trash2, User, Clock,
    ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface MessagesListProps {
    initialSubmissions: ContactSubmission[];
}

export function MessagesList({ initialSubmissions }: MessagesListProps) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const handleToggleRead = async (submission: ContactSubmission) => {
        setLoading(submission.id);
        const success = submission.isRead
            ? await markSubmissionAsUnread(submission.id)
            : await markSubmissionAsRead(submission.id);

        if (success) {
            setSubmissions(prev => prev.map(s =>
                s.id === submission.id ? { ...s, isRead: !s.isRead } : s
            ));
        }
        setLoading(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        setLoading(id);
        const success = await deleteSubmission(id);

        if (success) {
            setSubmissions(prev => prev.filter(s => s.id !== id));
        }
        setLoading(null);
    };

    const handleExpand = async (submission: ContactSubmission) => {
        if (expandedId === submission.id) {
            setExpandedId(null);
        } else {
            setExpandedId(submission.id);
            // Mark as read when expanded
            if (!submission.isRead) {
                const success = await markSubmissionAsRead(submission.id);
                if (success) {
                    setSubmissions(prev => prev.map(s =>
                        s.id === submission.id ? { ...s, isRead: true } : s
                    ));
                }
            }
        }
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-3">
            {submissions.map((submission) => (
                <div
                    key={submission.id}
                    className={`bg-card rounded-xl border shadow-sm overflow-hidden transition-all ${!submission.isRead ? 'border-purple-500/50 bg-purple-50/50 dark:bg-purple-900/10' : ''
                        }`}
                >
                    {/* Message Header */}
                    <div
                        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleExpand(submission)}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={`p-2 rounded-full shrink-0 ${submission.isRead
                                        ? 'bg-muted text-muted-foreground'
                                        : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'
                                    }`}>
                                    {submission.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`font-medium truncate ${!submission.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {submission.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {submission.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                            {submission.profileName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(submission.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {submission.message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {expandedId === submission.id ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === submission.id && (
                        <div className="border-t px-4 py-4 bg-muted/20">
                            <div className="mb-4">
                                <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                                <p className="text-foreground whitespace-pre-wrap">{submission.message}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t">
                                <a
                                    href={`mailto:${submission.email}`}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    Reply
                                </a>

                                <button
                                    onClick={() => handleToggleRead(submission)}
                                    disabled={loading === submission.id}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors disabled:opacity-50"
                                >
                                    {submission.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                                    Mark as {submission.isRead ? 'unread' : 'read'}
                                </button>

                                <button
                                    onClick={() => handleDelete(submission.id)}
                                    disabled={loading === submission.id}
                                    className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors disabled:opacity-50 ml-auto"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
