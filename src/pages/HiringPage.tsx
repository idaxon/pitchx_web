import React from 'react';
import { HiringProvider } from '../context/HiringContext';
import { EnterpriseHiringDashboard } from '../components/hiring/EnterpriseHiringDashboard';

/**
 * HiringPage — the Enterprise ATS & Hiring Management hub.
 * Wraps the HiringProvider so all child components have access
 * to the hiring workflow engine without polluting the global AppContext.
 */
export const HiringPage: React.FC = () => {
  return (
    <HiringProvider>
      <EnterpriseHiringDashboard />
    </HiringProvider>
  );
};
