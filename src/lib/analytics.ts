/**
 * Analytics helpers for Facebook Pixel and Google Analytics.
 * All calls are wrapped in try/catch so that ad blockers or missing
 * scripts never break the lead submission flow.
 *
 * Requirements: 9.4, 9.5
 */

// Extend the global Window interface to declare the optional analytics globals.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Facebook Pixel "Lead" event and a Google Analytics "generate_lead"
 * event. Silently swallows any errors caused by blocked or missing scripts.
 */
export function trackLead(): void {
  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
  } catch {
    // Script blocked or unavailable — fail silently.
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead');
    }
  } catch {
    // Script blocked or unavailable — fail silently.
  }
}
