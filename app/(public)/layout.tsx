import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Tracker — Kenya Police Service',
  description: 'Track the status of your reported case',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {children}
    </div>
  );
}
