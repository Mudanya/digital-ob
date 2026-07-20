'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  LayoutDashboard,
  FileText,
  Users,
  Car,
  Scale,
  FileBarChart,
  Settings,
  Shield,
  MapPin,
  Calendar,
  Building2,
  ClipboardList,
  UserCog,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Database,
  Award,
  Activity,
  Folder,
  X,
  Crosshair,
  UserCheck,
  ScrollText,
} from 'lucide-react';
import { UserRole } from '@/generated/prisma/enums';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

const navigationItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'OCP',
      'INSPECTOR',
      'SERGEANT',
      'CORPORAL',
      'CONSTABLE',
    ],
  },
  {
    name: 'OB Entries',
    href: '/ob-entries',
    icon: <FileText className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'OCP',
      'INSPECTOR',
      'SERGEANT',
      'CORPORAL',
      'CONSTABLE',
    ],
  },
  {
    name: 'Case Management',
    href: '/cases',
    icon: <Folder className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'OCP',
      'INSPECTOR',
      'SERGEANT',
      'CORPORAL',
      'CONSTABLE',
    ],
  },
  {
    name: 'Traffic Offenses',
    href: '/traffic',
    icon: <Car className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'OCP',
      'SERGEANT',
      'CORPORAL',
      'CONSTABLE',
    ],
  },
  {
    name: 'Court Cases',
    href: '/court-cases',
    icon: <Scale className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'INSPECTOR',
    ],
  },
  {
    name: 'Charge Sheets',
    href: '/charge-sheets/new',
    icon: <ScrollText className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'INSPECTOR',
    ],
  },
  {
    name: 'Arms Registry',
    href: '/arms',
    icon: <Crosshair className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'OCP',
      'INSPECTOR',
    ],
  },
  {
    name: 'Civilian Firearms',
    href: '/civilian-firearms',
    icon: <UserCheck className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
    ],
  },
  {
    name: 'Officers',
    href: '/officers',
    icon: <Users className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
    ],
  },
  {
    name: 'Duty Roster',
    href: '/duty-roster',
    icon: <Calendar className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'SERGEANT',
    ],
  },
  {
    name: 'Stations',
    href: '/stations',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'COUNTY_COMMANDER'],
  },
  {
    name: 'Counties',
    href: '/counties',
    icon: <MapPin className="h-5 w-5" />,
    roles: ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <TrendingUp className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <FileBarChart className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCPD',
      'OCS',
      'INSPECTOR',
    ],
  },
  {
    name: 'Audit Logs',
    href: '/audit-logs',
    icon: <Activity className="h-5 w-5" />,
    roles: [
      'INSPECTOR_GENERAL',
      'DEPUTY_INSPECTOR_GENERAL',
      'COUNTY_COMMANDER',
      'OCS',
    ],
  },
  {
    name: 'System Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['INSPECTOR_GENERAL', 'DEPUTY_INSPECTOR_GENERAL', 'OCS'],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Filter menu items based on user role
  const allowedMenuItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className={`
      fixed lg:static
      inset-y-0 left-0
      w-64 
      bg-slate-900/50 backdrop-blur-sm 
      border-r border-white/10 
      min-h-screen 
      flex flex-col
      z-50
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Logo & User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Digital OB</h1>
            <p className="text-xs text-gray-400">Kenya Police Service</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-green-500 h-2 w-2 rounded-full"></div>
            <p className="text-sm font-semibold text-white">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <p className="text-xs text-gray-400">{user.rank}</p>
          <p className="text-xs text-gray-500 mt-1">{user.serviceNumber}</p>
          {user.station && (
            <p className="text-xs text-blue-400 mt-1">{user.station.name}</p>
          )}
        </div>
      </div>

      {/* Station Status (for station-level officers) */}
      {user.station && (
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-xs font-semibold text-gray-400 mb-3">
            Station Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Officers On Duty</span>
              <span className="text-xs font-bold text-green-400">23/32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-300">Active Cases</span>
              <span className="text-xs font-bold text-orange-400">156</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {allowedMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}