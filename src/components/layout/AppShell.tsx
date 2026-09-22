import React from 'react';
import { Topbar } from './Topbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MobileNav } from './MobileNav';
import { useApp } from '../../context/AppContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activePage, authRole } = useApp();

  // Full width pages: Analytics, Explore, Jobs (Candidate Applications dashboard), and Recruiter profile
  const isFullWidthPage =
    activePage === 'analytics' ||
    activePage === 'explore' ||
    activePage === 'jobs' ||
    (activePage === 'profile' && authRole === 'recruiter');

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#1A1A19] flex flex-col antialiased selection:bg-[#F9BE08] selection:text-[#1A1A19]">
      <Topbar />

      <main className="flex-1 max-w-[1480px] w-full mx-auto px-3 sm:px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
          {/* Left Column: Fixed / Sticky Navigation & Profile (hidden on mobile, 3 cols on md/lg, 3 cols on xl) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3 xl:col-span-3">
            <div className="sticky top-20">
              <LeftSidebar />
            </div>
          </div>

          {/* Center Column: Primary Feed & View */}
          <div
            className={`col-span-1 md:col-span-8 ${
              isFullWidthPage
                ? 'lg:col-span-9 xl:col-span-9'
                : 'lg:col-span-6 xl:col-span-6'
            } min-w-0`}
          >
            {children}
          </div>

          {/* Right Column: Trending Topics & Who To Follow (desktop only, hidden on tablet and mobile) */}
          {!isFullWidthPage && (
            <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
              <div className="sticky top-20">
                <RightSidebar />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
