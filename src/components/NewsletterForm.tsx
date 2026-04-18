'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  variant?: 'dark' | 'light';
}

export default function NewsletterForm({ variant = 'dark' }: Props) {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur, réessayez.');
      }
    } catch {
      setStatus('error');
      setMessage('Connexion impossible.');
    }
  };

  const isDark = variant === 'dark';

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 py-3 px-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-green-50 border border-green-200'}`}>
        <CheckCircle className={`h-5 w-5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-green-800'}`}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={`pl-9 ${
              isDark
                ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#D4A418]'
                : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          className="bg-[#B8860B] hover:bg-[#9A7209] text-white font-semibold px-4 shrink-0"
        >
          {status === 'loading'
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : 'S\'inscrire'
          }
        </Button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </form>
  );
}
