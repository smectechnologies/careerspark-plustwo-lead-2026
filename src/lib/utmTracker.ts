/**
 * UTM Tracker
 *
 * Captures UTM parameters from a URL and persists them in sessionStorage
 * so they remain available throughout the session.
 *
 * Storage key: 'careerspark_utm'
 */

export interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const STORAGE_KEY = 'careerspark_utm';

const UTM_PARAMS: ReadonlyArray<keyof UtmData> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

/**
 * Reads utm_source, utm_medium, utm_campaign, utm_content, and utm_term
 * from the given URL and writes them to sessionStorage under the key
 * 'careerspark_utm'. Absent parameters are stored as empty strings.
 */
export function captureUtmParams(url: URL): void {
  const data: UtmData = {
    utm_source: url.searchParams.get('utm_source') ?? '',
    utm_medium: url.searchParams.get('utm_medium') ?? '',
    utm_campaign: url.searchParams.get('utm_campaign') ?? '',
    utm_content: url.searchParams.get('utm_content') ?? '',
    utm_term: url.searchParams.get('utm_term') ?? '',
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Reads and returns the stored UTM object from sessionStorage.
 * Returns all-empty-string defaults if the key is absent or the stored
 * value cannot be parsed.
 */
export function getUtmParams(): UtmData {
  const defaults: UtmData = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  };

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as Partial<UtmData>;

    // Ensure every expected key is present and is a string
    return UTM_PARAMS.reduce<UtmData>((acc, key) => {
      acc[key] = typeof parsed[key] === 'string' ? (parsed[key] as string) : '';
      return acc;
    }, { ...defaults });
  } catch {
    return defaults;
  }
}
