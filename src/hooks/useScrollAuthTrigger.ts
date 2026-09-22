import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const useScrollAuthTrigger = (threshold: number = 300) => {
  const {
    isAuthModalOpen,
    hasDismissedAuthScroll,
    openAuthModal,
    activePage,
  } = useApp();

  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // If modal is already open, user already dismissed in this session, or on dedicated auth page, do nothing
    if (hasDismissedAuthScroll || hasTriggeredRef.current || activePage === 'login' || activePage === 'signup') {
      return;
    }

    const handleScroll = () => {
      if (hasTriggeredRef.current || hasDismissedAuthScroll) return;

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
  }, [hasDismissedAuthScroll, isAuthModalOpen, openAuthModal, activePage, threshold]);
};
