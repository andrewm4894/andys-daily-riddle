import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { posthog, initPostHog } from '@/lib/posthog';

type PostHogProviderProps = {
  children: React.ReactNode;
};

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const [location] = useLocation();

  // Initialize PostHog on component mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views when the location changes
  useEffect(() => {
    if (typeof window !== 'undefined' && location) {
      posthog.capture('$pageview', {
        current_url: window.location.href,
        path: location,
      });
    }
  }, [location]);

  return <>{children}</>;
}