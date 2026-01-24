'use client';

import { useAuth } from '@/contexts/auth-context';
import IGDashboard from './ig-dashboard';
import CountyCommanderDashboard from './county-commander-dashboard';
import OCSDashboard from './ocs-dashboard';
import ConstableDashboard from './constable-dashboard';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'INSPECTOR_GENERAL':
    case 'DEPUTY_INSPECTOR_GENERAL':
      return <IGDashboard />;

    case 'COUNTY_COMMANDER':
      return <CountyCommanderDashboard />;

    case 'OCPD':
    case 'OCS':
    case 'OCP':
      return <OCSDashboard />;

    case 'INSPECTOR':
    case 'SERGEANT':
      // Inspectors and Sergeants use OCS dashboard with their station context
      return <OCSDashboard />;

    case 'CORPORAL':
    case 'CONSTABLE':
      return <ConstableDashboard />;

    default:
      return <OCSDashboard />;
  }
}
