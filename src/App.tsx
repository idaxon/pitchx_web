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
import { ProjectDetailModal } from './components/project/ProjectDetailModal';
import { CreateProjectModal } from './components/project/CreateProjectModal';
import { CommentDrawer } from './components/comments/CommentDrawer';
import { SearchOverlay } from './components/search/SearchOverlay';

const MainRouter: React.FC = () => {
  const { activePage } = useApp();

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
