import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { TopicPage } from './pages/TopicPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { MessagesPage } from './pages/MessagesPage';
import { JobsPage } from './pages/JobsPage';
import { RetestAssessmentPage } from './pages/RetestAssessmentPage';
import { HiringPage } from './pages/HiringPage';
import { AuthPage } from './pages/AuthPage';
import { ProjectDetailModal } from './components/project/ProjectDetailModal';
import { CreateProjectModal } from './components/project/CreateProjectModal';
import { CommentDrawer } from './components/comments/CommentDrawer';
import { SearchOverlay } from './components/search/SearchOverlay';
import { AuthModal } from './components/auth/AuthModal';
import { useScrollAuthTrigger } from './hooks/useScrollAuthTrigger';

const MainRouter: React.FC = () => {
  const { activePage } = useApp();

  // Trigger popup when visitor scrolls down the page
  useScrollAuthTrigger(280);

  if (activePage === 'login' || activePage === 'signup') {
    return (
      <>
        <AuthPage />
        <AuthModal />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'profile':
        return <ProfilePage />;
      case 'topic':
        return <TopicPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'messages':
        return <MessagesPage />;
      case 'jobs':
        return <JobsPage />;
      case 'hiring':
        return <HiringPage />;
      case 'retest':
        return <RetestAssessmentPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppShell>
      {renderCurrentPage()}
      {/* Global Modals & Drawers */}
      <ProjectDetailModal />
      <CreateProjectModal />
      <CommentDrawer />
      <SearchOverlay />
      <AuthModal />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}

