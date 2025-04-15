import posthog from 'posthog-js';

// Initialize PostHog with your project API key
export const initPostHog = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Initialize PostHog
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY || '', {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      // Enable debug mode in development
      debug: import.meta.env.DEV,
      // Only capture events in production
      capture_pageview: import.meta.env.PROD,
      // Disable automatic pageview tracking - we'll handle this manually
      // with our router
      disable_session_recording: false,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          // Log when PostHog is loaded in development
          console.log('PostHog loaded');
        }
      },
    });
  }

  return posthog;
};

// Export PostHog instance
export { posthog };