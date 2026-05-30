# Requirements Document

## Introduction

CareerSpark is a modern, mobile-first AstroJS web application designed to generate student leads from Facebook and Instagram advertisements. The application presents a premium native-app-like experience where students answer a short questionnaire about their Plus Two results and stream, then instantly receive personalised course recommendations. All lead data is persisted to Google Sheets via the Google Sheets API / Google Apps Script Webhook. The application supports UTM tracking, Facebook Pixel, Google Analytics, PWA installation, and is optimised for mobile conversion.

---

## Glossary

- **CareerSpark**: The name of the application being built.
- **Lead**: A prospective student who submits the intake form.
- **Plus Two**: The secondary school leaving certificate (Grade 12) examination in India.
- **SSLC**: Secondary School Leaving Certificate (Grade 10) examination in India.
- **Stream**: The academic specialisation chosen by a student (Science, Commerce, Humanities, Computer Science, Biology Science).
- **Recommendation_Engine**: The client-side logic that maps a student's result and stream to a list of recommended courses.
- **Google_Sheets_API**: The Google Sheets REST API used to append lead rows to a spreadsheet.
- **Apps_Script_Webhook**: A Google Apps Script Web App endpoint that receives POST requests and writes data to Google Sheets.
- **UTM_Parameters**: URL query parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term) used to track advertisement traffic sources.
- **Facebook_Pixel**: Meta's JavaScript tracking snippet for measuring ad conversion events.
- **PWA**: Progressive Web App — a web application installable on a device home screen.
- **Glassmorphism**: A UI design style using frosted-glass translucent cards with blur effects.
- **GSAP**: GreenSock Animation Platform, a JavaScript animation library.
- **Framer_Motion**: A React/component animation library used for declarative animations.
- **Lottie**: A JSON-based animation format rendered via the Lottie player library.
- **Confetti**: A celebratory particle animation triggered on successful form submission.
- **Mobile_Shell**: A centred CSS container styled to resemble a physical mobile phone frame, shown on desktop viewports.
- **WhatsApp_CTA**: A call-to-action button that opens a pre-filled WhatsApp chat with a career expert.
- **Dark_Theme**: The default colour scheme using dark backgrounds (#0F172A) with light text.
- **Passed_Form**: The intake form shown when the student selects "PASSED" for their Plus Two result.
- **Failed_Form**: The intake form shown when the student selects "FAILED" for their Plus Two result.
- **Success_Screen**: The screen displayed after successful form submission, showing recommended courses.
- **Course_Card**: A UI card component displaying a single recommended course.
- **Toggle**: An animated iOS-style binary switch component for selecting PASSED / FAILED.

---

## Requirements

### Requirement 1: Mobile-First Layout and Desktop Shell

**User Story:** As a student visiting CareerSpark from any device, I want the application to look and feel like a premium native mobile app, so that I have an engaging, app-like experience regardless of whether I am on a phone or a desktop browser.

#### Acceptance Criteria

1. THE CareerSpark SHALL render with a maximum content width of 430px and a height of 100vh on all viewport sizes.
2. WHILE the viewport width is greater than 430px, THE CareerSpark SHALL display the content centred inside a Mobile_Shell with rounded corners of 32px, simulating a physical phone frame.
3. WHILE the viewport width is 430px or less, THE CareerSpark SHALL render in full-screen mode without the Mobile_Shell frame.
4. THE CareerSpark SHALL apply the Dark_Theme as the default colour scheme using background colour #0F172A.
5. THE CareerSpark SHALL apply Glassmorphism card styles using background rgba(255,255,255,0.08) with backdrop blur on all card components.
6. THE CareerSpark SHALL render floating gradient background elements using primary colour #2D318F, secondary colour #00AA9E, and accent colour #0070BC.
7. THE CareerSpark SHALL apply a gradient from blue (#0070BC) to teal (#00AA9E) on all primary action buttons.

---

### Requirement 2: Landing Screen

**User Story:** As a student arriving from a social media advertisement, I want to see a clear, welcoming landing screen that immediately prompts me to start the career discovery process, so that I understand the purpose of the app and feel motivated to engage.

#### Acceptance Criteria

1. THE CareerSpark SHALL display the CareerSpark logo at the top-centre of the first screen.
2. THE CareerSpark SHALL display the heading "Discover Your Perfect Career Path" on the first screen.
3. THE CareerSpark SHALL display the sub-heading "Answer a few questions and get instant course recommendations." on the first screen.
4. THE CareerSpark SHALL display the question "What is your Plus Two Result?" on the first screen.
5. THE CareerSpark SHALL display an animated Toggle component with two states: "PASSED" and "FAILED".
6. WHEN the Toggle is set to "PASSED", THE CareerSpark SHALL display the Passed_Form below the Toggle.
7. WHEN the Toggle is set to "FAILED", THE CareerSpark SHALL display the Failed_Form below the Toggle.
8. THE Toggle SHALL animate its state transition using a smooth sliding motion with a minimum duration of 300ms.

---

### Requirement 3: Passed Form

**User Story:** As a student who passed their Plus Two examination, I want to fill in a short form with my details and stream, so that I receive course recommendations relevant to my academic background.

#### Acceptance Criteria

1. THE Passed_Form SHALL collect the following fields: Full Name, City, Phone Number, Email, Plus Two Stream, and Percentage.
2. THE Passed_Form SHALL present Plus Two Stream as a selectable list containing exactly: Science, Commerce, Humanities, Computer Science, Biology Science.
3. THE Passed_Form SHALL validate that Full Name is not empty before submission.
4. THE Passed_Form SHALL validate that Phone Number contains exactly 10 digits before submission.
5. THE Passed_Form SHALL validate that Email matches a standard email format before submission.
6. THE Passed_Form SHALL validate that Percentage is a numeric value between 0 and 100 before submission.
7. IF any validation rule is violated, THEN THE Passed_Form SHALL display an inline error message adjacent to the offending field without clearing other field values.
8. WHEN all fields are valid and the student submits the Passed_Form, THE CareerSpark SHALL proceed to save the lead and display the Success_Screen.

---

### Requirement 4: Failed Form

**User Story:** As a student who failed their Plus Two examination, I want to fill in a short form with my SSLC details, so that I receive course recommendations appropriate for my qualification level.

#### Acceptance Criteria

1. THE Failed_Form SHALL collect the following fields: Full Name, City, Phone Number, Email, SSLC Percentage, and Previous Stream.
2. THE Failed_Form SHALL present Previous Stream as a selectable list containing exactly: Science, Commerce, Humanities, Computer Science, Biology Science.
3. THE Failed_Form SHALL validate that Full Name is not empty before submission.
4. THE Failed_Form SHALL validate that Phone Number contains exactly 10 digits before submission.
5. THE Failed_Form SHALL validate that Email matches a standard email format before submission.
6. THE Failed_Form SHALL validate that SSLC Percentage is a numeric value between 0 and 100 before submission.
7. IF any validation rule is violated, THEN THE Failed_Form SHALL display an inline error message adjacent to the offending field without clearing other field values.
8. WHEN all fields are valid and the student submits the Failed_Form, THE CareerSpark SHALL proceed to save the lead and display the Success_Screen.

---

### Requirement 5: Lead Data Persistence to Google Sheets

**User Story:** As a marketing team member, I want every submitted lead to be automatically saved to Google Sheets, so that I can track and follow up with prospective students without managing a separate database.

#### Acceptance Criteria

1. WHEN a form is successfully submitted, THE CareerSpark SHALL send a POST request to the Apps_Script_Webhook endpoint within 3 seconds of submission.
2. THE Apps_Script_Webhook SHALL append one row to the configured Google Sheet containing the following columns in order: Timestamp, Name, City, Phone, Email, Result, Stream, Percentage, Recommended Courses, Source, Device, Campaign.
3. THE CareerSpark SHALL populate the Timestamp column with the ISO 8601 UTC datetime of the submission.
4. THE CareerSpark SHALL populate the Source column with the value of the utm_source UTM_Parameter if present, otherwise with the value "direct".
5. THE CareerSpark SHALL populate the Device column with "mobile" when the viewport width is 430px or less, and "desktop" otherwise.
6. THE CareerSpark SHALL populate the Campaign column with the value of the utm_campaign UTM_Parameter if present, otherwise with an empty string.
7. THE CareerSpark SHALL populate the Recommended Courses column with a comma-separated list of all course names recommended to the student.
8. IF the POST request to the Apps_Script_Webhook fails, THEN THE CareerSpark SHALL retry the request once after a 2-second delay before displaying an error message to the student.
9. THE CareerSpark SHALL NOT use MySQL or any relational database for lead storage.

---

### Requirement 6: Course Recommendation Engine

**User Story:** As a student who has submitted the form, I want to instantly see a personalised list of recommended courses based on my result and stream, so that I can make an informed decision about my next educational step.

#### Acceptance Criteria

1. WHEN the student submits the Passed_Form with Stream set to "Science", THE Recommendation_Engine SHALL recommend: Professional Diploma in Industrial Automation with AI, Diploma in Instrumentation & Control Systems, Industrial Robotics with AI, Ship Maintenance Engineer Course, Professional Diploma in Cyber Security, Professional Linux & AWS Cloud Architect, Professional Microsoft & Azure Cloud Architect, Certified Networking Engineer (Windows), AI Integrated Graphic Designing & Video Editing, Professional Diploma in Digital Marketing with AI.
2. WHEN the student submits the Passed_Form with Stream set to "Computer Science", THE Recommendation_Engine SHALL recommend: Professional Diploma in Cyber Security, Professional Linux & AWS Cloud Architect, Professional Microsoft & Azure Cloud Architect, Certified Networking Engineer (Windows), Professional Diploma in Embedded Firmware, Industrial Robotics with AI, Certified Advanced IoT Engineer, AI Integrated Graphic Designing & Video Editing, Professional Diploma in Digital Marketing with AI.
3. WHEN the student submits the Passed_Form with Stream set to "Commerce", THE Recommendation_Engine SHALL recommend: Diploma Indian & Foreign Accounting Professional, Professional Diploma in Corporate Account Management, Professional Diploma in Financial Analyst Management, Professional Diploma in Digital Marketing with AI, Diploma in HR Management and Office Administration, Professional Diploma in SCM and Logistics, Diploma in Marine Logistics, Diploma in Hospital Administration.
4. WHEN the student submits the Passed_Form with Stream set to "Humanities", THE Recommendation_Engine SHALL recommend: Professional Diploma in Digital Marketing with AI, Diploma in HR Management and Office Administration, Professional Diploma in SCM and Logistics, Diploma in Marine Logistics, Diploma in Hospital Administration, Professional Diploma in Health Care and Hospitality Management, AI Integrated Graphic Designing & Video Editing.
5. WHEN the student submits the Passed_Form with Stream set to "Biology Science", THE Recommendation_Engine SHALL recommend: Diploma in Hospital Administration, Professional Diploma in Health Care and Hospitality Management, PG Diploma in Healthcare and Business Management, Ship Maintenance Engineer Course, Professional Diploma in Digital Marketing with AI, Professional Diploma in SCM and Logistics, AI Integrated Graphic Designing & Video Editing.
6. WHEN the student submits the Failed_Form, THE Recommendation_Engine SHALL recommend: Diploma in Hospital Administration, Diploma in HR Management and Office Administration, Professional Diploma in Digital Marketing with AI, AI Integrated Graphic Designing & Video Editing, Professional Diploma in SCM and Logistics, Diploma in Marine Logistics, Professional Diploma in Health Care and Hospitality Management, Ship Maintenance Engineer Course, Diploma in Instrumentation & Control Systems, Diploma in BMS, Diploma in Oil & Gas Technician.
7. THE Recommendation_Engine SHALL execute entirely on the client side without making additional network requests to determine recommendations.
8. THE Recommendation_Engine SHALL NOT include fees, price, or salary information in any recommendation output.

---

### Requirement 7: Course Card Display

**User Story:** As a student viewing recommendations, I want each course presented in a visually appealing card with key details, so that I can quickly evaluate which courses interest me.

#### Acceptance Criteria

1. THE Course_Card SHALL display the following information for each recommended course: Course Name, Duration, Eligibility, and a Short Career Description.
2. THE Course_Card SHALL display an "Explore Course" button that navigates to a course detail page or external URL.
3. THE Course_Card SHALL NOT display fees, price, or salary information.
4. THE Course_Card SHALL apply Glassmorphism styling consistent with the overall Dark_Theme.
5. WHEN a Course_Card enters the viewport, THE CareerSpark SHALL animate it with a fade-up entrance animation using GSAP.
6. WHEN a student hovers over a Course_Card on desktop, THE Course_Card SHALL apply a visible hover effect such as a border highlight or scale transform.
7. WHILE the student is on the Success_Screen on a mobile viewport, THE CareerSpark SHALL support horizontal swipe gestures to navigate between Course_Cards.

---

### Requirement 8: Success Screen

**User Story:** As a student who has submitted the form, I want to see a celebratory success screen with my recommended courses and a clear next step, so that I feel rewarded and know how to proceed.

#### Acceptance Criteria

1. WHEN the lead is successfully saved, THE CareerSpark SHALL display the Success_Screen with the heading "🎉 Your Career Recommendations Are Ready".
2. THE Success_Screen SHALL display all recommended Course_Cards for the student's result and stream.
3. THE Success_Screen SHALL display a sticky bottom button labelled "Talk to Career Expert" that opens a WhatsApp_CTA link in a new browser tab.
4. WHEN the Success_Screen is first displayed, THE CareerSpark SHALL trigger a Confetti animation lasting a minimum of 2 seconds.
5. THE WhatsApp_CTA link SHALL open `https://wa.me/` followed by the configured career expert phone number with a pre-filled message.

---

### Requirement 9: UTM and Lead Source Tracking

**User Story:** As a digital marketing manager, I want all UTM parameters from advertisement links to be captured and stored with each lead, so that I can measure the ROI of each campaign accurately.

#### Acceptance Criteria

1. WHEN the CareerSpark page loads, THE CareerSpark SHALL read and store the values of utm_source, utm_medium, utm_campaign, utm_content, and utm_term from the URL query string.
2. THE CareerSpark SHALL persist captured UTM_Parameters in sessionStorage so that they remain available if the student navigates within the app.
3. WHEN a lead is submitted, THE CareerSpark SHALL include the stored UTM_Parameters in the data sent to the Apps_Script_Webhook.
4. WHEN the Facebook_Pixel script is loaded and a form is successfully submitted, THE CareerSpark SHALL fire a Facebook_Pixel "Lead" event.
5. WHEN the Google Analytics script is loaded and a form is successfully submitted, THE CareerSpark SHALL fire a Google Analytics "generate_lead" event.

---

### Requirement 10: Progressive Web App (PWA) Support

**User Story:** As a student who frequently visits CareerSpark, I want to be able to install the app on my home screen, so that I can access it quickly like a native application.

#### Acceptance Criteria

1. THE CareerSpark SHALL include a valid Web App Manifest file with name, short_name, icons, theme_color, background_color, and display set to "standalone".
2. THE CareerSpark SHALL register a Service Worker that caches static assets for offline access.
3. WHEN the browser fires the "beforeinstallprompt" event, THE CareerSpark SHALL display an install prompt popup inviting the student to add the app to their home screen.
4. WHEN the student dismisses the install prompt, THE CareerSpark SHALL not display the prompt again during the same session.

---

### Requirement 11: Performance and Loading Experience

**User Story:** As a student arriving from a mobile advertisement, I want the application to load quickly and display smooth animations, so that I do not abandon the page before seeing the content.

#### Acceptance Criteria

1. THE CareerSpark SHALL achieve a Lighthouse Performance score of 80 or above on mobile.
2. THE CareerSpark SHALL lazy-load all images and Lottie animation assets that are not visible in the initial viewport.
3. THE CareerSpark SHALL display a loading animation while the application initialises, and hide it once the first screen is fully rendered.
4. THE CareerSpark SHALL display a Particle background animation on the landing screen using a lightweight canvas-based implementation.
5. WHEN a Lottie animation asset is used, THE CareerSpark SHALL load it asynchronously and display a placeholder until the asset is ready.

---

### Requirement 12: SEO and Metadata

**User Story:** As a marketing team member, I want the CareerSpark pages to be properly indexed by search engines and share correctly on social media, so that organic and paid traffic both benefit from accurate metadata.

#### Acceptance Criteria

1. THE CareerSpark SHALL include a descriptive `<title>` tag and `<meta name="description">` tag on every page.
2. THE CareerSpark SHALL include Open Graph meta tags (og:title, og:description, og:image, og:url) on every page.
3. THE CareerSpark SHALL include a canonical URL `<link>` tag on every page.
4. THE CareerSpark SHALL generate a sitemap.xml file at build time listing all public pages.
5. THE CareerSpark SHALL include a robots.txt file that allows all search engine crawlers.

---

### Requirement 13: Accessibility and Internationalisation Baseline

**User Story:** As a student using assistive technology, I want the application to be navigable and understandable, so that I can complete the career discovery process regardless of my accessibility needs.

#### Acceptance Criteria

1. THE CareerSpark SHALL provide a visible focus indicator on all interactive elements when navigated via keyboard.
2. THE CareerSpark SHALL include descriptive `aria-label` attributes on all icon-only buttons and Toggle components.
3. THE CareerSpark SHALL maintain a colour contrast ratio of at least 4.5:1 between text and its background for all body text.
4. THE CareerSpark SHALL include `alt` text on all informational images.
5. THE CareerSpark SHALL set the `lang` attribute on the `<html>` element to "en".
