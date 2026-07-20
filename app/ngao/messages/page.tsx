'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNgaoAuth } from '@/contexts/ngao-auth-context';
import Link from 'next/link';
import { Shield, ArrowLeft, Send, MessageSquare } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  COUNTY_COMMISSIONER: 'County Commissioner', SUB_COUNTY_COMMISSIONER: 'Sub-County Commissioner',
  CHIEF: 'Chief', SUB_CHIEF: 'Sub-Chief', ASSISTANT_CHIEF: 'Assistant Chief', VILLAGE_ELDER: 'Village Elder',
};

export default function NgaoMessagesPage() {
  const { ngaoUser, ngaoToken, isLoading } = useNgaoAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [toOfficerId, setToOfficerId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [officers, setOfficers] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isLoading && !ngaoUser) router.push('/ngao/login');
  }, [ngaoUser, isLoading]);

  useEffect(() => {
    if (ngaoToken) {
      fetchMessages();
      fetchOfficers();
    }
  }, [ngaoToken]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/ngao/messages', { headers: { Authorization: `Bearer ${ngaoToken}` } });
      if (res.ok) setMessages((await res.json()).messages || []);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchOfficers = async () => {
    const res = await fetch('/api/ngao/officers', { headers: { Authorization: `Bearer ${ngaoToken}` } });
    if (res.ok) setOfficers((await res.json()).officers || []);
  };

  const handleSend = async () => {
    if (!subject || !message || !toOfficerId) return;
    setSending(true);
    try {
      const res = await fetch('/api/ngao/messages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ngaoToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ toOfficerId, subject, message }),
      });
      if (res.ok) {
        setComposeOpen(false);
        setToOfficerId(''); setSubject(''); setMessage('');
        fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  const isFromMe = (msg: any) => msg.fromNgaoId === ngaoUser?.id;

  if (isLoading || !ngaoUser) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
          <p className="text-white font-semibold text-sm">NGAO Portal</p>
          <Link href="/ngao/dashboard" className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-gray-400 text-sm mt-0.5">Communication with police station officers</p>
          </div>
          <button
            onClick={() => setComposeOpen(v => !v)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Send className="h-4 w-4" /> Compose
          </button>
        </div>

        {composeOpen && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            <h2 className="text-white font-medium text-sm">New Message to Police Officer</h2>
            <select
              value={toOfficerId}
              onChange={e => setToOfficerId(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 transition-all"
            >
              <option value="" className="bg-slate-800">Select recipient officer...</option>
              {officers.map(o => <option key={o.id} value={o.id} className="bg-slate-800">{o.firstName} {o.lastName} — {o.rank} ({o.station?.name || 'No station'})</option>)}
            </select>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
            />
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Your message..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setComposeOpen(false)} className="flex-1 py-2 border border-white/20 text-gray-300 rounded-xl text-sm transition-colors hover:border-white/40">Cancel</button>
              <button onClick={handleSend} disabled={sending || !subject || !message || !toOfficerId} className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                <Send className="h-4 w-4" /> {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loadingMessages ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No messages yet</p>
            </div>
          ) : messages.map(msg => {
            const mine = isFromMe(msg);
            return (
              <div key={msg.id} className={`bg-white/5 border rounded-xl p-4 ${!msg.isRead && !mine ? 'border-green-500/40' : 'border-white/10'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.isRead && !mine && <span className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0" />}
                      <p className="text-white font-medium text-sm">{msg.subject}</p>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">
                      {mine
                        ? `To: ${msg.toNgao ? `${msg.toNgao.name} (${ROLE_LABELS[msg.toNgao.role] || msg.toNgao.role})` : 'Police Officer'}`
                        : `From: ${msg.fromNgao ? `${msg.fromNgao.name} (${ROLE_LABELS[msg.fromNgao.role] || msg.fromNgao.role})` : 'Police Officer'}`
                      }
                    </p>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${mine ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {mine ? 'Sent' : 'Received'}
                    </span>
                    <p className="text-gray-500 text-xs mt-1">{new Date(msg.createdAt).toLocaleDateString('en-KE')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
