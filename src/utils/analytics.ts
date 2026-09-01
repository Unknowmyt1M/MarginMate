import { AnalyticsEventType, AnalyticsEventData } from '../types/calculator';

/**
 * Lightweight analytics event tracker for V0 validation.
 * Captures non-sensitive aggregate metrics to measure user engagement.
 */
export function trackEvent(eventType: AnalyticsEventType, data?: AnalyticsEventData): void {
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    ...data,
  };

  // Log in non-production environments for verification
  if (import.meta.env.DEV) {
    console.log('[MarginMate Analytics Event]', payload);
  }

  // Hook for future production analytics provider (e.g. Plausible, PostHog, Google Analytics)
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).gtag) {
    const gtag = (window as unknown as Record<string, (cmd: string, action: string, params: object) => void>).gtag;
    gtag('event', eventType, data || {});
  }
}
