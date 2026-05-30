/**
 * Smoke tests for all src/lib modules.
 *
 * These tests verify that each library function is importable and returns
 * the expected types. They serve as a checkpoint before UI component work begins.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// validation.ts
// ---------------------------------------------------------------------------

import {
  validateName,
  validatePhone,
  validateEmail,
  validatePercentage,
} from '../validation';

describe('validateName', () => {
  it('returns null for a valid name', () => {
    expect(validateName('Alice')).toBeNull();
  });

  it('returns an error string for an empty string', () => {
    expect(validateName('')).toBeTypeOf('string');
  });

  it('returns an error string for whitespace-only input', () => {
    expect(validateName('   ')).toBeTypeOf('string');
  });
});

describe('validatePhone', () => {
  it('returns null for exactly 10 digits', () => {
    expect(validatePhone('9876543210')).toBeNull();
  });

  it('returns an error string for fewer than 10 digits', () => {
    expect(validatePhone('12345')).toBeTypeOf('string');
  });

  it('returns an error string for more than 10 digits', () => {
    expect(validatePhone('12345678901')).toBeTypeOf('string');
  });

  it('returns an error string when non-digit characters are present', () => {
    expect(validatePhone('987654321a')).toBeTypeOf('string');
  });
});

describe('validateEmail', () => {
  it('returns null for a valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });

  it('returns an error string for an address without @', () => {
    expect(validateEmail('userexample.com')).toBeTypeOf('string');
  });

  it('returns an error string for an address without a dot in the domain', () => {
    expect(validateEmail('user@examplecom')).toBeTypeOf('string');
  });

  it('returns an error string for an empty string', () => {
    expect(validateEmail('')).toBeTypeOf('string');
  });
});

describe('validatePercentage', () => {
  it('returns null for 0', () => {
    expect(validatePercentage('0')).toBeNull();
  });

  it('returns null for 100', () => {
    expect(validatePercentage('100')).toBeNull();
  });

  it('returns null for a value in the middle of the range', () => {
    expect(validatePercentage('75.5')).toBeNull();
  });

  it('returns an error string for a negative value', () => {
    expect(validatePercentage('-1')).toBeTypeOf('string');
  });

  it('returns an error string for a value above 100', () => {
    expect(validatePercentage('101')).toBeTypeOf('string');
  });

  it('returns an error string for a non-numeric string', () => {
    expect(validatePercentage('abc')).toBeTypeOf('string');
  });

  it('returns an error string for an empty string', () => {
    expect(validatePercentage('')).toBeTypeOf('string');
  });
});

// ---------------------------------------------------------------------------
// recommendationEngine.ts
// ---------------------------------------------------------------------------

import { getRecommendations } from '../recommendationEngine';

describe('getRecommendations', () => {
  it('returns an array for result=passed with Science stream', () => {
    const result = getRecommendations('passed', 'Science');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an array for result=passed with Commerce stream', () => {
    const result = getRecommendations('passed', 'Commerce');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an array for result=passed with Humanities stream', () => {
    const result = getRecommendations('passed', 'Humanities');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an array for result=passed with Computer Science stream', () => {
    const result = getRecommendations('passed', 'Computer Science');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an array for result=passed with Biology Science stream', () => {
    const result = getRecommendations('passed', 'Biology Science');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an array for result=failed (stream ignored)', () => {
    const result = getRecommendations('failed');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each returned course has the required fields', () => {
    const courses = getRecommendations('passed', 'Science');
    for (const course of courses) {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('name');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('eligibility');
      expect(course).toHaveProperty('careerDescription');
      expect(course).toHaveProperty('exploreUrl');
    }
  });

  it('no returned course contains fee, price, cost, salary, or earnings fields', () => {
    const courses = getRecommendations('passed', 'Science');
    for (const course of courses) {
      expect(course).not.toHaveProperty('fee');
      expect(course).not.toHaveProperty('price');
      expect(course).not.toHaveProperty('cost');
      expect(course).not.toHaveProperty('salary');
      expect(course).not.toHaveProperty('earnings');
    }
  });

  it('returns an empty array and does not throw for unknown input', () => {
    // @ts-expect-error — intentionally passing invalid input
    expect(() => getRecommendations('unknown', 'Unknown')).not.toThrow();
    // @ts-expect-error
    expect(getRecommendations('unknown', 'Unknown')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// utmTracker.ts
// ---------------------------------------------------------------------------

import { captureUtmParams, getUtmParams } from '../utmTracker';

describe('captureUtmParams / getUtmParams', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('stores and retrieves UTM parameters from a URL', () => {
    const url = new URL(
      'https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_content=banner&utm_term=career'
    );
    captureUtmParams(url);
    const params = getUtmParams();
    expect(params.utm_source).toBe('google');
    expect(params.utm_medium).toBe('cpc');
    expect(params.utm_campaign).toBe('spring');
    expect(params.utm_content).toBe('banner');
    expect(params.utm_term).toBe('career');
  });

  it('stores absent UTM params as empty strings', () => {
    captureUtmParams(new URL('https://example.com/'));
    const params = getUtmParams();
    expect(params.utm_source).toBe('');
    expect(params.utm_medium).toBe('');
    expect(params.utm_campaign).toBe('');
    expect(params.utm_content).toBe('');
    expect(params.utm_term).toBe('');
  });

  it('returns all-empty defaults when sessionStorage has no entry', () => {
    const params = getUtmParams();
    expect(params.utm_source).toBe('');
    expect(params.utm_medium).toBe('');
    expect(params.utm_campaign).toBe('');
    expect(params.utm_content).toBe('');
    expect(params.utm_term).toBe('');
  });
});

// ---------------------------------------------------------------------------
// analytics.ts
// ---------------------------------------------------------------------------

import { trackLead } from '../analytics';

describe('trackLead', () => {
  it('does not throw when fbq and gtag are undefined', () => {
    // jsdom does not define fbq or gtag — this should be a no-op
    expect(() => trackLead()).not.toThrow();
  });

  it('calls window.fbq with "track", "Lead" when defined', () => {
    const fbq = vi.fn();
    (window as unknown as Record<string, unknown>).fbq = fbq;
    trackLead();
    expect(fbq).toHaveBeenCalledWith('track', 'Lead');
    delete (window as unknown as Record<string, unknown>).fbq;
  });

  it('calls window.gtag with "event", "generate_lead" when defined', () => {
    const gtag = vi.fn();
    (window as unknown as Record<string, unknown>).gtag = gtag;
    trackLead();
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead');
    delete (window as unknown as Record<string, unknown>).gtag;
  });
});

// ---------------------------------------------------------------------------
// leadService.ts
// ---------------------------------------------------------------------------

import { buildPayload } from '../leadService';
import type { Course } from '../../data/courses';

describe('buildPayload', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const sampleForm = {
    name: 'Alice',
    city: 'Kochi',
    phone: '9876543210',
    email: 'alice@example.com',
    percentage: '85',
  };

  const sampleCourses: Course[] = [
    {
      id: 'cyber-security',
      name: 'Professional Diploma in Cyber Security',
      duration: '6 months',
      eligibility: 'Plus Two (Science / Computer Science)',
      careerDescription: 'Protect networks.',
      exploreUrl: '/courses/cyber-security',
    },
    {
      id: 'linux-aws',
      name: 'Professional Linux & AWS Cloud Architect',
      duration: '6 months',
      eligibility: 'Plus Two (Science / Computer Science)',
      careerDescription: 'Architect cloud infra.',
      exploreUrl: '/courses/linux-aws',
    },
  ];

  it('returns a payload with all required fields', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(payload).toHaveProperty('timestamp');
    expect(payload).toHaveProperty('name', 'Alice');
    expect(payload).toHaveProperty('city', 'Kochi');
    expect(payload).toHaveProperty('phone', '9876543210');
    expect(payload).toHaveProperty('email', 'alice@example.com');
    expect(payload).toHaveProperty('result', 'passed');
    expect(payload).toHaveProperty('stream', 'Science');
    expect(payload).toHaveProperty('percentage', '85');
    expect(payload).toHaveProperty('recommendedCourses');
    expect(payload).toHaveProperty('source');
    expect(payload).toHaveProperty('device');
    expect(payload).toHaveProperty('campaign');
    expect(payload).toHaveProperty('utm_medium');
    expect(payload).toHaveProperty('utm_content');
    expect(payload).toHaveProperty('utm_term');
  });

  it('timestamp is a valid ISO 8601 UTC string', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(() => new Date(payload.timestamp)).not.toThrow();
    expect(new Date(payload.timestamp).toISOString()).toBe(payload.timestamp);
  });

  it('source defaults to "direct" when no UTM source is stored', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(payload.source).toBe('direct');
  });

  it('source uses utm_source when it is stored', () => {
    captureUtmParams(new URL('https://example.com/?utm_source=google'));
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(payload.source).toBe('google');
  });

  it('recommendedCourses is a comma-separated list of course names', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(payload.recommendedCourses).toBe(
      'Professional Diploma in Cyber Security, Professional Linux & AWS Cloud Architect'
    );
  });

  it('device is "mobile" or "desktop"', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(['mobile', 'desktop']).toContain(payload.device);
  });

  it('campaign defaults to empty string when no UTM campaign is stored', () => {
    const payload = buildPayload(sampleForm, 'passed', 'Science', sampleCourses);
    expect(payload.campaign).toBe('');
  });
});
