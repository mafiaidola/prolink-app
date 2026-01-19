import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getContactSubmissions } from '@/lib/contact-actions';
import { MessagesList } from './messages-list';
import { Mail, Inbox } from 'lucide-react';

export default async function MessagesPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const submissions = await getContactSubmissions();
    const unreadCount = submissions.filter(s => !s.isRead).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                    <p className="text-muted-foreground mt-1">
                        Contact form submissions from your profiles.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        <Mail className="h-4 w-4" />
                        {unreadCount} unread
                    </div>
                )}
            </div>

            {/* Messages List */}
            {submissions.length === 0 ? (
                <div className="bg-card rounded-xl p-12 border shadow-sm text-center">
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">No messages yet</h2>
                    <p className="text-muted-foreground">
                        When visitors submit contact forms on your profiles, they will appear here.
                    </p>
                </div>
            ) : (
                <MessagesList initialSubmissions={submissions} />
            )}
        </div>
    );
}
