import { DashCardItem } from '@/types';
import { FileText, AlertCircle, Users, Scale } from 'lucide-react';

export const CardItems: DashCardItem[] = [
  {
    title: 'Total Cases',
    value: 0,
    icon: FileText,
    change: '+0% from last month',
    color: 'bg-blue-500',
  },
  {
    title: 'Pending Cases',
    value: 0,
    icon: AlertCircle,
    change: '0 urgent',
    color: 'bg-orange-500',
  },
  {
    title: 'Officers Active',
    value: 0,
    icon: Users,
    change: 'All shifts covered',
    color: 'bg-green-500',
  },
  {
    title: 'Court Cases',
    value: 0,
    icon: Scale,
    change: '0 this week',
    color: 'bg-purple-500',
  },
];