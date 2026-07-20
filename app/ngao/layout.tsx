import type { Metadata } from 'next';
import { NgaoAuthProvider } from '@/contexts/ngao-auth-context';

export const metadata: Metadata = {
  title: 'NGAO Portal — National Government Administration Officers',
  description: 'Portal for Chiefs, Sub-Chiefs, and Administration Officers',
};

export default function NgaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <NgaoAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {children}
      </div>
    </NgaoAuthProvider>
  );
}
