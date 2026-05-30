import { COURSES, type Course } from '../data/courses';

export type ResultType = 'passed' | 'failed';
export type Stream = 'Science' | 'Commerce' | 'Humanities' | 'Computer Science' | 'Biology Science';

const RECOMMENDATION_MAP: Record<string, string[]> = {
  'passed:Science': [
    'industrial-automation',
    'instrumentation-control',
    'industrial-robotics',
    'ship-maintenance',
    'cyber-security',
    'linux-aws',
    'microsoft-azure',
    'networking-windows',
    'graphic-design-ai',
    'digital-marketing-ai',
  ],
  'passed:Computer Science': [
    'cyber-security',
    'linux-aws',
    'microsoft-azure',
    'networking-windows',
    'embedded-firmware',
    'industrial-robotics',
    'iot-engineer',
    'graphic-design-ai',
    'digital-marketing-ai',
  ],
  'passed:Commerce': [
    'indian-foreign-accounting',
    'corporate-account-management',
    'financial-analyst',
    'digital-marketing-ai',
    'hr-management',
    'scm-logistics',
    'marine-logistics',
    'hospital-administration',
  ],
  'passed:Humanities': [
    'digital-marketing-ai',
    'hr-management',
    'scm-logistics',
    'marine-logistics',
    'hospital-administration',
    'healthcare-hospitality',
    'graphic-design-ai',
  ],
  'passed:Biology Science': [
    'hospital-administration',
    'healthcare-hospitality',
    'pg-healthcare-business',
    'ship-maintenance',
    'digital-marketing-ai',
    'scm-logistics',
    'graphic-design-ai',
  ],
  'failed': [
    'bms-diploma',
    'oil-gas-technician',
  ],
};

/**
 * Returns a list of recommended Course objects for the given result and stream.
 * For result='passed', a stream must be provided.
 * For result='failed', stream is ignored.
 * Returns an empty array and logs a warning for unknown inputs.
 */
export function getRecommendations(result: ResultType, stream?: Stream): Course[] {
  const key = result === 'failed' ? 'failed' : `passed:${stream}`;

  const ids = RECOMMENDATION_MAP[key];

  if (!ids) {
    console.warn(
      `[recommendationEngine] Unknown input: result="${result}", stream="${stream}". Returning empty array.`
    );
    return [];
  }

  return ids
    .map((id) => {
      const course = COURSES[id];
      if (!course) {
        console.warn(`[recommendationEngine] Course id "${id}" not found in catalogue.`);
      }
      return course;
    })
    .filter((course): course is Course => course !== undefined);
}
