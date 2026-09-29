import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useScrollAuthTrigger = (threshold: number = 120) => {
  const {
    isAuthenticated,
    isAuthModalOpen,
    hasDismissedAuthScroll,
    openAuthModal,
    activePage,
  } = useApp();

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Only trigger for unauthenticated guests, not on auth pages or if already dismissed/open
    if (
      isAuthenticated ||
      hasDismissedAuthScroll ||
      hasTriggeredRef.current ||
      isAuthModalOpen ||
      activePage === 'login' ||
      activePage === 'signup'
    ) {
      return;
    }

    const handleScroll = () => {
      if (hasTriggeredRef.current || hasDismissedAuthScroll || isAuthenticated) return;

      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      if (currentScrollY > threshold) {
        hasTriggeredRef.current = true;
        openAuthModal('signup', 'jobseeker');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAuthenticated, hasDismissedAuthScroll, isAuthModalOpen, openAuthModal, activePage, threshold]);
};

