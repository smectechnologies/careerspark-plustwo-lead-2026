# Implementation Plan: CareerSpark Mobile App

## Overview

Implement the CareerSpark mobile-first AstroJS lead-generation app in incremental steps: project scaffolding and core library functions first, then UI components, then integration wiring. Each step builds on the previous and ends with all code connected. Testing sub-tasks are placed close to the code they validate.

## Tasks

- [x] 1. Scaffold project and configure tooling
  - Initialise AstroJS project with TypeScript support
  - Install dependencies: `gsap`, `canvas-confetti`, `@vite-pwa/astro`, `vitest`, `fast-check`
  - Configure `vitest.config.ts` with jsdom environment for component tests
  - Create `src/styles/global.css` with CSS custom properties: Dark Theme (`#0F172A`), primary (`#2D318F`), secondary (`#00AA9E`), accent (`#0070BC`), Glassmorphism utilities, gradient button class
  - Create `public/manifest.webmanifest` with `name`, `short_name`, `icons`, `theme_color`, `background_color`, `display: "standalone"`
  - Create `public/robots.txt` allowing all crawlers
  - Create `public/icons/` directory with required PWA icon set
  - Set `lang="en"` on the `<html>` element in the root layout
  - _Requirements: 1.4, 1.5, 1.6, 1.7, 10.1, 12.5, 13.5_

- [x] 2. Implement core library: data catalogue and recommendation engine
  - [x] 2.1 Create course catalogue in `src/data/courses.ts`
    - Define `Course` interface with fields: `id`, `name`, `duration`, `eligibility`, `careerDescription`, `exploreUrl`
    - Populate `COURSES` record with all courses referenced in the design (industrial-automation, instrumentation-control, industrial-robotics, ship-maintenance, cyber-security, linux-aws, microsoft-azure, networking-windows, graphic-design-ai, digital-marketing-ai, embedded-firmware, iot-engineer, indian-foreign-accounting, corporate-account-management, financial-analyst, hr-management, scm-logistics, marine-logistics, hospital-administration, healthcare-hospitality, pg-healthcare-business, bms-diploma, oil-gas-technician)
    - Ensure no `fee`, `price`, `cost`, `salary`, or `earnings` fields are present on any course object
    - _Requirements: 6.1–6.6, 6.8, 7.1, 7.3_

  - [x] 2.2 Implement `src/lib/recommendationEngine.ts`
    - Define `RECOMMENDATION_MAP` keyed by `"passed:<Stream>"` and `"failed"` as specified in the design
    - Implement `getRecommendations(result: ResultType, stream?: Stream): Course[]` as a pure lookup returning `Course` objects from the catalogue
    - Return empty array and `console.warn` for unknown inputs
    - _Requirements: 6.1–6.7_

  - [ ]* 2.3 Write property tests for recommendation engine
    - **Property 6: Recommendation engine returns correct courses for every stream**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
    - **Property 7: No recommendation contains fee, price, or salary data**
    - **Validates: Requirements 6.8, 7.3**
    - File: `src/lib/__tests__/recommendationEngine.test.ts`

- [x] 3. Implement core library: validation functions
  - [x] 3.1 Implement `src/lib/validation.ts`
    - `validateName(value: string): string | null` — rejects blank/whitespace-only strings
    - `validatePhone(value: string): string | null` — accepts exactly 10 ASCII digit characters
    - `validateEmail(value: string): string | null` — accepts standard `local@domain.tld` format
    - `validatePercentage(value: string): string | null` — accepts numeric values in [0, 100], rejects non-numeric strings
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 3.2 Write property tests for validation functions
    - **Property 1: Name validation rejects blank and whitespace-only strings**
    - **Validates: Requirements 3.3, 4.3**
    - **Property 2: Phone validation accepts only exactly 10-digit strings**
    - **Validates: Requirements 3.4, 4.4**
    - **Property 3: Email validation correctly classifies valid and invalid addresses**
    - **Validates: Requirements 3.5, 4.5**
    - **Property 4: Percentage validation accepts only values in [0, 100]**
    - **Validates: Requirements 3.6, 4.6**
    - **Property 5: Form validation preserves valid field values on partial failure**
    - **Validates: Requirements 3.7, 4.7**
    - File: `src/lib/__tests__/validation.test.ts`

- [x] 4. Implement core library: UTM tracker and analytics helpers
  - [x] 4.1 Implement `src/lib/utmTracker.ts`
    - `captureUtmParams(url: URL): void` — reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from URL and writes to `sessionStorage` under key `careerspark_utm`; absent params stored as empty strings
    - `getUtmParams(): UtmData` — reads and returns the stored UTM object; returns all-empty-string defaults if key absent
    - _Requirements: 9.1, 9.2_

  - [ ]* 4.2 Write property tests for UTM tracker
    - **Property 14: UTM parameters are round-tripped through sessionStorage**
    - **Validates: Requirements 9.1, 9.2**
    - File: `src/lib/__tests__/utmTracker.test.ts`

  - [x] 4.3 Implement `src/lib/analytics.ts`
    - `trackLead(): void` — calls `window.fbq('track', 'Lead')` and `window.gtag('event', 'generate_lead')` wrapped in `try/catch`; silently swallows errors if scripts are blocked
    - _Requirements: 9.4, 9.5_

- [x] 5. Implement lead service
  - [x] 5.1 Implement `src/lib/leadService.ts`
    - Define `LeadPayload` and `WebhookPayload` interfaces as specified in the design
    - Implement `buildPayload(formData, result, stream, recommendations): WebhookPayload` — constructs the full payload including ISO 8601 UTC timestamp, source fallback to `"direct"`, device classification (`<= 430px` → `"mobile"`, else `"desktop"`), campaign fallback to `""`, comma-separated `recommendedCourses`, and all UTM fields from `getUtmParams()`
    - Implement `submitLead(payload: WebhookPayload): Promise<void>` — POSTs JSON to `import.meta.env.PUBLIC_WEBHOOK_URL`; on non-2xx or network error, waits 2 seconds and retries once; throws after second failure
    - _Requirements: 5.1–5.8_

  - [ ]* 5.2 Write property tests for lead service
    - **Property 9: Timestamp is always a valid ISO 8601 UTC string**
    - **Validates: Requirements 5.3**
    - **Property 10: Source field correctly falls back to "direct"**
    - **Validates: Requirements 5.4**
    - **Property 11: Device field is correctly classified by viewport width**
    - **Validates: Requirements 5.5**
    - **Property 12: Campaign field correctly falls back to empty string**
    - **Validates: Requirements 5.6**
    - **Property 13: Recommended courses column is a comma-separated list of all course names**
    - **Validates: Requirements 5.7**
    - **Property 15: UTM parameters are included in the webhook payload**
    - **Validates: Requirements 9.3**
    - File: `src/lib/__tests__/leadService.test.ts`

- [x] 6. Checkpoint — Ensure all library tests pass
  - Run `vitest --run` and confirm all tests in `src/lib/__tests__/` pass before proceeding to UI components.
  - Ask the user if any questions arise.

- [x] 7. Implement layout and landing components
  - [x] 7.1 Create `src/components/layout/MobileShell.astro`
    - Renders a centred container with max-width 430px, height 100vh, rounded corners 32px on viewports > 430px
    - On viewports ≤ 430px renders full-screen without the frame
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 7.2 Create `src/components/layout/ParticleBackground.astro`
    - Lightweight canvas-based particle animation using a `requestAnimationFrame` loop
    - Renders behind all other content on the landing screen
    - _Requirements: 11.4_

  - [x] 7.3 Create `src/components/landing/Logo.astro`, `HeroText.astro`
    - `Logo.astro`: renders the CareerSpark logo at top-centre with non-empty `alt` text
    - `HeroText.astro`: renders heading "Discover Your Perfect Career Path" and sub-heading "Answer a few questions and get instant course recommendations."
    - _Requirements: 2.1, 2.2, 2.3, 13.4_

  - [x] 7.4 Create `src/components/landing/ResultToggle.astro` (client:load island)
    - Animated iOS-style toggle with two states: "PASSED" and "FAILED"; default state "PASSED"
    - State transition uses smooth sliding motion ≥ 300ms CSS transition
    - On state change emits `CustomEvent` on `window` with detail `'passed'` or `'failed'`
    - Includes non-empty `aria-label` attribute
    - Includes visible `:focus-visible` style
    - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 13.1, 13.2_

- [x] 8. Implement form components
  - [x] 8.1 Create `src/components/forms/FormField.astro`
    - Reusable labelled input/select with `<span role="alert">` for inline error display
    - Includes visible `:focus-visible` style on the input/select element
    - _Requirements: 3.7, 4.7, 13.1_

  - [x] 8.2 Create `src/components/forms/PassedForm.astro` (client:load island)
    - Renders fields: Full Name, City, Phone Number, Email, Plus Two Stream (select with exactly 5 options: Science, Commerce, Humanities, Computer Science, Biology Science), Percentage
    - On submit: runs all validation functions; displays inline errors for invalid fields without clearing valid field values; on all-valid calls `submitLead` then shows Success Screen
    - Submit button uses gradient blue-to-teal style and has visible `:focus-visible` style
    - _Requirements: 3.1–3.8_

  - [x] 8.3 Create `src/components/forms/FailedForm.astro` (client:load island)
    - Renders fields: Full Name, City, Phone Number, Email, SSLC Percentage, Previous Stream (select with exactly 5 options: Science, Commerce, Humanities, Computer Science, Biology Science)
    - Same validation and submission behaviour as PassedForm; uses `result: 'failed'` in payload
    - _Requirements: 4.1–4.8_

- [x] 9. Implement course card and success screen components
  - [x] 9.1 Create `src/components/recommendations/CourseCard.astro`
    - Displays: Course Name, Duration, Eligibility, Short Career Description, "Explore Course" button linking to `exploreUrl`
    - Does NOT display fees, price, or salary
    - Applies Glassmorphism styling consistent with Dark Theme
    - GSAP fade-up entrance animation when card enters viewport (ScrollTrigger)
    - Hover effect (border highlight or scale transform) on desktop
    - "Explore Course" button has visible `:focus-visible` style
    - _Requirements: 7.1–7.6_

  - [ ]* 9.2 Write property tests for CourseCard rendering
    - **Property 8: Course card renders all required fields**
    - **Validates: Requirements 7.1**
    - File: `src/components/recommendations/__tests__/CourseCard.test.ts`

  - [x] 9.3 Create `src/components/recommendations/CourseCardList.astro`
    - Horizontal swipeable container for course cards on mobile viewports
    - Supports touch swipe gestures for navigation between cards
    - _Requirements: 7.7_

  - [x] 9.4 Create `src/components/recommendations/SuccessScreen.astro` (client:load island)
    - Displays heading "🎉 Your Career Recommendations Are Ready"
    - Renders `CourseCardList` with all recommended `CourseCard` components for the student's result and stream
    - Triggers `canvas-confetti` animation on mount lasting ≥ 2 seconds
    - Sticky bottom "Talk to Career Expert" button opening WhatsApp CTA in new tab: `https://wa.me/<phone>?text=<encodedMessage>`
    - WhatsApp button has visible `:focus-visible` style and descriptive `aria-label`
    - _Requirements: 8.1–8.5, 13.1, 13.2_

  - [ ]* 9.5 Write property tests for SuccessScreen
    - **Property 16: WhatsApp CTA URL is correctly constructed**
    - **Validates: Requirements 8.5**
    - **Property 17: Success screen displays all recommended course cards**
    - **Validates: Requirements 8.2**
    - File: `src/components/recommendations/__tests__/SuccessScreen.test.ts`

- [x] 10. Implement PWA install prompt component
  - [x] 10.1 Create `src/components/pwa/InstallPrompt.astro` (client:load island)
    - Listens for `beforeinstallprompt` event; displays install banner when event fires
    - On dismiss: hides banner and does not show again for the session (sessionStorage flag)
    - _Requirements: 10.3, 10.4_

- [x] 11. Compose root page and wire all components together
  - [x] 11.1 Create `src/pages/index.astro`
    - Compose `MobileShell`, `ParticleBackground`, `Logo`, `HeroText`, `ResultToggle`, `PassedForm`, `FailedForm`, `InstallPrompt` in correct layout order
    - Listen for Toggle `CustomEvent` on window; show/hide `PassedForm` / `FailedForm` accordingly (default: PassedForm visible)
    - Call `captureUtmParams(new URL(window.location.href))` on page load
    - Include `<title>`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), and canonical `<link>` in `<head>`
    - Set `lang="en"` on `<html>`
    - Include Facebook Pixel and Google Analytics script tags
    - Wire `submitLead` success path to mount `SuccessScreen` and call `trackLead()`
    - Wire `submitLead` failure path to display inline error toast "Something went wrong. Please try again." without clearing form data
    - _Requirements: 2.5, 2.6, 2.7, 5.1, 9.1, 9.4, 9.5, 12.1, 12.2, 12.3, 13.5_

  - [x] 11.2 Configure `@vite-pwa/astro` integration in `astro.config.mjs`
    - Register service worker for static asset caching
    - Point to `public/manifest.webmanifest`
    - Catch and silently log service worker registration errors
    - _Requirements: 10.1, 10.2_

  - [x] 11.3 Configure Astro sitemap integration to generate `sitemap.xml` at build time
    - _Requirements: 12.4_

  - [x] 11.4 Add lazy loading (`loading="lazy"`) to all images not in the initial viewport
    - _Requirements: 11.2_

  - [x] 11.5 Implement loading animation shown during app initialisation; hide once first screen is fully rendered
    - _Requirements: 11.3_

- [ ] 12. Implement accessibility properties
  - [x] 12.1 Audit and apply visible `:focus-visible` CSS rules to all interactive elements
    - Add rules in `global.css` covering `button`, `input`, `select`, `a`, `[tabindex]`
    - Ensure `outline` or `box-shadow` is set to a non-`none`/non-`0` value
    - _Requirements: 13.1_

  - [ ]* 12.2 Write property tests for accessibility
    - **Property 18: All interactive elements have a visible focus style**
    - **Validates: Requirements 13.1**
    - **Property 19: All icon-only buttons and Toggle have non-empty aria-labels**
    - **Validates: Requirements 13.2**
    - **Property 20: All text/background color pairs meet 4.5:1 contrast ratio**
    - **Validates: Requirements 13.3**
    - **Property 21: All informational images have non-empty alt text**
    - **Validates: Requirements 13.4**
    - File: `src/__tests__/accessibility.test.ts`

- [ ] 13. Write integration tests
  - [ ]* 13.1 Write integration tests for webhook POST and retry logic
    - Mock `fetch`; verify payload shape matches `WebhookPayload` interface
    - Verify single retry after 2-second delay on failure
    - Verify error toast shown after second failure
    - _Requirements: 5.1, 5.8_

  - [ ]* 13.2 Write integration tests for analytics events
    - Mock `window.fbq` and `window.gtag`; submit form; verify `fbq('track', 'Lead')` and `gtag('event', 'generate_lead')` called
    - _Requirements: 9.4, 9.5_

- [x] 14. Final checkpoint — Ensure all tests pass
  - Run `vitest --run` and confirm all tests pass.
  - Verify build completes without errors (`astro build`).
  - Ask the user if any questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Each task references specific requirements for traceability.
- Checkpoints (tasks 6 and 14) ensure incremental validation.
- Property tests use **fast-check** with Vitest; each test file includes a comment referencing the design property number.
- Unit tests and property tests are complementary — both are included.
- The webhook URL is injected at build time via `PUBLIC_WEBHOOK_URL` environment variable.
- The WhatsApp phone number and pre-filled message should be stored as environment variables or constants in `SuccessScreen`.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "4.1", "4.3"] },
    { "id": 2, "tasks": ["2.3", "3.2", "4.2", "5.1"] },
    { "id": 3, "tasks": ["5.2", "7.1", "7.2", "7.3", "7.4"] },
    { "id": 4, "tasks": ["8.1", "9.1", "10.1"] },
    { "id": 5, "tasks": ["8.2", "8.3", "9.2", "9.3"] },
    { "id": 6, "tasks": ["9.4", "9.5"] },
    { "id": 7, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5"] },
    { "id": 8, "tasks": ["12.1"] },
    { "id": 9, "tasks": ["12.2", "13.1", "13.2"] }
  ]
}
```
