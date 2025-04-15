import { posthog } from '@/lib/posthog';

export function usePostHog() {
  /**
   * Track an event with PostHog
   * @param eventName The name of the event to track
   * @param properties Optional properties to include with the event
   */
  const captureEvent = (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  };

  /**
   * Identify a user with PostHog
   * @param userId The ID of the user to identify
   * @param properties Optional properties to include with the identification
   */
  const identify = (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  };

  /**
   * Reset the current user's identity
   */
  const reset = () => {
    posthog.reset();
  };

  return {
    captureEvent,
    identify,
    reset,
    posthog,
  };
}