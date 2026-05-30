/**
 * Lead Service
 *
 * Builds the webhook payload from form data and submits it to the
 * Google Apps Script endpoint.
 *
 * WHY no-cors + URLSearchParams?
 * ──────────────────────────────
 * Google Apps Script Web Apps do not send CORS headers that allow
 * cross-origin requests with Content-Type: application/json.
 * The only reliable way to POST from a static site is:
 *   - mode: 'no-cors'
 *   - body: URLSearchParams (application/x-www-form-urlencoded)
 *
 * With no-cors the response is opaque (we can't read it), so we treat
 * any completed fetch as a success. The Apps Script reads the fields
 * from e.parameter (form-encoded) instead of e.postData.contents (JSON).
 *
 * Retries once after 2 seconds on network failure.
 */

import { getUtmParams } from './utmTracker';
import type { Course } from '../data/courses';
import type { ResultType, Stream } from './recommendationEngine';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface WebhookPayload {
  timestamp: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  result: 'passed' | 'failed';
  stream: string;
  percentage: string;
  recommendedCourses: string;
  source: string;
  device: 'mobile' | 'desktop';
  campaign: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
}

export interface FormData {
  name: string;
  city: string;
  phone: string;
  email: string;
  percentage: string;
}

// ---------------------------------------------------------------------------
// buildPayload
// ---------------------------------------------------------------------------

export function buildPayload(
  formData: FormData,
  result: ResultType,
  stream: Stream,
  recommendations: Course[]
): WebhookPayload {
  const utmParams = getUtmParams();

  return {
    timestamp:          new Date().toISOString(),
    name:               formData.name,
    city:               formData.city,
    phone:              formData.phone,
    email:              formData.email,
    result,
    stream,
    percentage:         formData.percentage,
    recommendedCourses: recommendations.map((c) => c.name).join(', '),
    source:             utmParams.utm_source !== '' ? utmParams.utm_source : 'direct',
    device:             typeof window !== 'undefined' && window.innerWidth <= 430 ? 'mobile' : 'desktop',
    campaign:           utmParams.utm_campaign,
    utm_medium:         utmParams.utm_medium,
    utm_content:        utmParams.utm_content,
    utm_term:           utmParams.utm_term,
  };
}

// ---------------------------------------------------------------------------
// submitLead
// ---------------------------------------------------------------------------

/**
 * Submits the lead payload to the Google Apps Script Web App.
 *
 * Uses mode:'no-cors' + URLSearchParams so the request works from any
 * static hosting origin without CORS preflight issues.
 *
 * Retries once after 2 s on network error.
 * Throws on second failure so the form can show an error toast.
 */
export async function submitLead(payload: WebhookPayload): Promise<void> {
  const url = import.meta.env.PUBLIC_WEBHOOK_URL as string;

  if (!url) {
    throw new Error('PUBLIC_WEBHOOK_URL is not set. Add it to your .env file.');
  }

  // Convert payload to URL-encoded form data
  const body = new URLSearchParams();
  (Object.keys(payload) as Array<keyof WebhookPayload>).forEach((key) => {
    body.append(key, String(payload[key]));
  });

  const attemptPost = async (): Promise<void> => {
    await fetch(url, {
      method: 'POST',
      mode:   'no-cors',          // required for Apps Script cross-origin POST
      body,
    });
    // no-cors responses are opaque — a completed fetch = success
  };

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await attemptPost();
  } catch {
    await delay(2000);
    await attemptPost(); // throws on second failure → form shows error toast
  }
}
