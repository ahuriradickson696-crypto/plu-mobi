import { useNavigate } from "react-router-dom";
import BigButton from "../../components/BigButton";

const LAST_UPDATED = "26 November 2026";
const VERSION = "v1.0.0 (Prototype)";
const CONTROLLER = "Patriotic League of Uganda, Plot 7 Saddler Lane, Naguru, Kampala, Uganda";
const DPO_EMAIL = "dpo@plu-mobi.ug";
const SUPPORT_EMAIL = "support@plu-mobi.ug";

const pages = {
  about: {
    title: "About PLU Mobi",
    content: `PLU Mobi is the official digital platform of the Patriotic League of Uganda (PLU), a civic movement registered and operating under the laws of the Republic of Uganda.

MISSION
To make membership open, verifiable, and accountable for every Ugandan at home and abroad.

OPERATING PRINCIPLES
PLU Mobi is built under the open participation model, per the PLU Secretariat Binding Principles (V1.1):
- Any person can register as a Patriotic Cadre at any time, without a campaign window or officer gate.
- Every member receives a unique, permanent PC number (format PC-XXXXXX) as their primary identifier.
- Any authenticated member can help another person register or endorse - a normal capability, not a privilege.
- Membership remains Tentative until administrative review, which never blocks participation.
- The Patriotic Officers register is a public reference only and is never a gate.
- All simulated functionality is clearly labelled; nothing is presented as live operation that is not.

CONTACT
Patriotic League of Uganda
Plot 7 Saddler Lane, Naguru, Kampala, Uganda
Telephone: 0414675689
Email: ${SUPPORT_EMAIL}

Last updated: ${LAST_UPDATED} · ${VERSION}`,
  },

  privacy: {
    title: "Privacy Policy",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

This Privacy Policy explains how the Patriotic League of Uganda ("PLU", "we", "us") collects, uses, discloses, and protects your personal data when you use PLU Mobi. It is issued under the Uganda Data Protection and Privacy Act, 2019 (Act No. 7 of 2019) and its 2021 Regulations, and, for users in the European Economic Area, the General Data Protection Regulation (EU) 2016/679 ("GDPR").

PART 1 - WHO WE ARE

1.1 Data Controller
${CONTROLLER}

1.2 Data Protection Officer
Email: ${DPO_EMAIL}
Postal address: as above, marked "For the Attention of the DPO"

PART 2 - DATA WE COLLECT AND WHY

2.1 Categories of Personal Data
(a) Identity data - full name, phone number, optional email, optional National Identification Number (NIN), optional photograph.
(b) Membership data - system-generated PC number, pathway (Uganda or Diaspora), district or country of residence, Tentative/Confirmed status, audit trail of who assisted registration.
(c) Authentication data - hashed PIN (bcrypt, minimum 12 rounds), session tokens (JWT, signed, short-lived).
(d) Technical data - IP address, device type, browser, log timestamps, for security and abuse prevention only.
(e) Communication data - support tickets, feedback, and consent records.

2.2 Lawful Basis for Processing
We process personal data on the following lawful bases:
(a) Consent - for optional data such as email, photograph, and endorsement publication.
(b) Contractual necessity - to register you as a member and provide the service.
(c) Legal obligation - to comply with the Uganda DPPA 2019, the Companies Act, and tax law.
(d) Legitimate interest - for security, fraud prevention, service integrity, and (where lawful) statistics.

2.3 Purposes
We process personal data solely to:
- Register you as a Patriotic Cadre and issue your PC number.
- Authenticate you when you sign in (phone or email + 6-digit PIN).
- Verify membership when the public enters your PC number - returning only the fields permitted by Blueprint §3.4 (name, PC number, status, pathway, district/country).
- Enable assisted registration and endorsement, with a basic audit of who helped whom (Blueprint FR-14).
- Detect and prevent fraud, abuse, and security incidents.
- Comply with legal obligations and respond to lawful requests.

2.4 We Do Not Process
- No payment data (the service is free and has no payments).
- No biometric data (no facial recognition, no fingerprints, no voiceprints).
- No background location tracking.
- No advertising profiles.
- No artificial intelligence scoring of members.

PART 3 - DISCLOSURE TO THIRD PARTIES

3.1 Categories of Recipients
- Infrastructure providers (hosting and database), under written processor agreements.
- Email service providers, solely to send transactional messages you request (confirmation, PIN reset).
- Public authorities, only when legally compelled and after legal review.

3.2 No Sale of Personal Data
We do not sell, rent, or trade personal data.

PART 4 - INTERNATIONAL TRANSFERS

4.1 Location of Processing
Our primary database is hosted in the European Union (Supabase, eu-west-1 region). Appropriate safeguards (EU Standard Contractual Clauses under GDPR Art. 46) apply. Transfers from Uganda are made under the Uganda DPPA 2019 §19 (adequacy or safeguards).

4.2 Rights Preserved
Your rights under this Policy are not diminished by cross-border processing.

PART 5 - RETENTION

5.1 Retention Periods
- Active member records: retained while membership is active.
- Tentative records never reviewed: 24 months, then archived.
- Deleted records: 30 days to complete erasure from backups, then permanently removed.
- Support tickets: 24 months.
- Consent records: life of the relationship + 6 years.
- Audit logs: 7 years (Blueprint FR-14 and tax/legal obligations).

5.2 Legal Holds
Where a legal hold applies, retention is extended until the matter is concluded.

PART 6 - SECURITY

6.1 Technical and Organisational Measures
- TLS 1.2+ for all data in transit; HSTS enforced.
- Encryption at rest in the database.
- bcrypt PIN hashing (OWASP-recommended minimum 12 rounds).
- JWT sessions with short expiry and revocation.
- Rate limiting, Helmet security headers, and CSRF defences.
- Role-based access control (member, reviewer, admin).
- Immutable audit logs (write-audit service).

6.2 Incident Notification
If a breach affects your personal data, we will notify you and the Uganda Personal Data Protection Office without undue delay and, where feasible, within 72 hours of becoming aware, per DPPA 2019 §23 and GDPR Art. 33.

PART 7 - YOUR RIGHTS

7.1 Rights You Can Exercise
Under DPPA 2019 (§§16–21) and GDPR (Arts. 15–22), you have the right to:
(a) be informed;
(b) access your personal data;
(c) correct inaccurate data;
(d) erase data ("right to be forgotten");
(e) restrict processing;
(f) data portability (receive a machine-readable copy);
(g) object to processing based on legitimate interest;
(h) not be subject to solely automated decisions;
(i) withdraw consent at any time, without affecting prior lawful processing.

7.2 How to Exercise Your Rights
Use the "My Data" page in your dashboard (one-click access, export, correction, and deletion request), or email ${DPO_EMAIL}. We respond within 30 days (extendable by 2 months for complex requests, with notice).

7.3 Complaints
You may complain to the Uganda Personal Data Protection Office (PDPO) at any time, or (for EEA users) to your local supervisory authority.

PART 8 - CHILDREN

PLU Mobi is not directed at children under 18. Where a member is 16–17, guardian consent is required. If we learn that we have collected data from a child without consent, we will delete it promptly.

PART 9 - CHANGES

We will notify you of material changes in-app and by email (if provided) at least 30 days before they take effect. Continued use after the effective date constitutes acceptance.

PART 10 - CONTACT

Data Protection Officer: ${DPO_EMAIL}
General support: ${SUPPORT_EMAIL}
Postal: ${CONTROLLER}

⚠ PROTOTYPE NOTICE
This Privacy Policy is prepared as prototype content under Blueprint §16 and Uganda DPPA 2019. It requires final review and sign-off by PLU Legal Counsel and the appointed Data Protection Officer before public launch. Section numbers cite Ugandan statutes and the GDPR for structural guidance only and do not constitute legal advice.`,
  },

  "data-protection": {
    title: "Data Protection Statement",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

This statement is issued by the Patriotic League of Uganda as Data Controller under the Uganda Data Protection and Privacy Act, 2019, and supplements the Privacy Policy.

1. DATA PROTECTION OFFICER

1.1 Appointment
The PLU Secretariat shall appoint a Data Protection Officer who reports directly to the Secretary General and is independent in the exercise of DPO functions.

1.2 Contact
Email: ${DPO_EMAIL}
Postal: ${CONTROLLER}, marked "For the Attention of the DPO"
Telephone: 0414675689

2. REGISTRATION WITH THE PDPO

PLU shall register as a Data Collector, Controller, or Processor with the Uganda Personal Data Protection Office as required by DPPA 2019 §6 and the 2021 Regulations, and shall renew registration as prescribed.

3. DATA PROTECTION IMPACT ASSESSMENT (DPIA)

A DPIA is conducted before any processing likely to result in high risk to data subjects, including:
- new categories of sensitive data;
- large-scale processing;
- new technologies (e.g., future photo capture, push notifications);
- cross-border transfers to new jurisdictions.

4. RECORDS OF PROCESSING

PLU maintains a Record of Processing Activities (ROPA) covering: purpose, categories of data subjects and data, recipients, retention, and security measures, per DPPA 2019 §18.

5. DATA SUBJECT REQUESTS

5.1 Channels
Data subject requests may be lodged via the "My Data" dashboard page or by email to ${DPO_EMAIL}.

5.2 Response
We acknowledge within 5 working days and respond substantively within 30 days (extendable by 2 months for complex requests, with notice), consistent with DPPA 2019 §21 and GDPR Art. 12.

5.3 Identity Verification
We verify identity to prevent disclosure of personal data to unauthorised parties.

6. BREACH NOTIFICATION

We maintain a documented breach response procedure. Where a breach is likely to result in a risk to rights and freedoms:
- the PDPO is notified without undue delay and, where feasible, within 72 hours;
- affected data subjects are notified without undue delay, with a description of the breach, likely consequences, and mitigation measures.

7. DATA PROTECTION BY DESIGN AND DEFAULT

All new features are assessed at design stage for data minimisation, purpose limitation, retention, and security (DPPA 2019 §17; GDPR Art. 25). This includes:
- field-level minimisation (e.g., NIN used only for endorsement deduplication);
- default-private settings;
- ability to operate the core service offline (per Blueprint §11).

8. PROCESSOR MANAGEMENT

All processors are bound by written data processing agreements that meet DPPA 2019 §20, including confidentiality, security, sub-processing controls, audit rights, and deletion/return obligations at end of service.

9. INTERNATIONAL TRANSFERS

Transfers outside Uganda are made only where the destination provides adequate protection, or with appropriate safeguards (standard contractual clauses, binding corporate rules), consistent with DPPA 2019 §19 and GDPR Chapter V.

10. TRAINING AND ACCOUNTABILITY

All PLU personnel and contractors with access to personal data complete annual data protection training. The DPO reports annually to the Secretariat on compliance, incidents, and improvements.

11. RETENTION SCHEDULE

- Active member records: while active.
- Tentative records: 24 months, then archived.
- Deleted records: 30 days to erase from backups.
- Support tickets: 24 months.
- Consent records: relationship + 6 years.
- Audit logs: 7 years.

12. COMPLAINTS

Complaints may be made to the DPO, or directly to the Uganda Personal Data Protection Office (PDPO).

⚠ PROTOTYPE NOTICE
This statement requires formal PLU Secretariat appointment of the DPO, PDPO registration completion, and PLU Legal Counsel sign-off before public launch.`,
  },

  terms: {
    title: "Terms of Service",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

These Terms of Service ("Terms") govern your access to and use of PLU Mobi (the "Service"), operated by the Patriotic League of Uganda ("PLU", "we", "us").

BY USING THE SERVICE, YOU AGREE TO THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THE SERVICE.

1. DEFINITIONS

"Member" means a registered Patriotic Cadre with a system-generated PC number.
"PC Number" means the unique permanent identifier in the format PC-XXXXXX.
"Tentative" means a membership pending administrative review but fully functional.
"Open Participation" means registration and participation are available to any eligible person at any time, without campaign windows or officer gates.

2. ELIGIBILITY

2.1 You must be at least 18 years old (or 16 with verifiable guardian consent), legally capable of entering a contract, and not barred from the Service under Ugandan law.

2.2 The Service is open to Ugandan citizens and members of the diaspora.

3. REGISTRATION AND ACCOUNT

3.1 You agree to provide accurate, current, and complete information.

3.2 You are responsible for maintaining the confidentiality of your PIN. You accept responsibility for all activity under your account.

3.3 One person may have only one membership record. Duplicate accounts may be merged or removed.

3.4 A PC number is issued on registration. It does not represent review, endorsement, or any other status beyond "registered member".

4. OPEN PARTICIPATION MODEL (BINDING)

4.1 Registration is permanently open. There is no campaign window, quota, waiting list, or seasonal closure.

4.2 No Patriotic Officer gate exists. You do not need any officer's approval to register, verify, endorse, or assist.

4.3 Any authenticated member may assist another person to register or endorse. This is a normal capability recorded in an audit log - not a privilege.

4.4 Assisted registration does not require any approval from an officer or administrator.

5. MEMBERSHIP STATUS

5.1 Your membership remains "Tentative" until an administrative review is completed.

5.2 Tentative status does not restrict your capabilities in the Service.

5.3 Administrative review may confirm your membership; it will never block your participation.

5.4 Reviewers are authorised PLU personnel. Review is not exclusive to Patriotic Officers.

6. ACCEPTABLE USE

You agree NOT to:
(a) impersonate another person;
(b) submit false corruption reports;
(c) attempt to access accounts, systems, or data you are not authorised to access;
(d) interfere with the Service's operation, security, or integrity;
(e) use the Service for unlawful purposes, including harassment, defamation, or fraud;
(f) scrape, harvest, or mine data except as expressly permitted;
(g) reverse-engineer, decompile, or disassemble the Service.

7. ASSISTED PARTICIPATION

7.1 When assisting another person, you must:
(a) obtain their informed consent before submitting data on their behalf;
(b) provide accurate information;
(c) explain the open participation model to them;
(d) keep their data confidential.

7.2 Misuse of assisted participation is a breach of these Terms.

8. ENDORSEMENTS

8.1 Endorsements are voluntary expressions of support for the League's agenda.

8.2 The National Identification Number, if provided, is used only for private deduplication and is never published or disclosed.

8.3 Only aggregated endorsement figures are published unless you explicitly opt in to public attribution.

8.4 You may withdraw an endorsement at any time via the dashboard.

9. CORRUPTION REPORTING

9.1 Reports may be submitted via the Service and tracked via a case reference.

9.2 You agree to report honestly and in good faith. False or malicious reports are prohibited.

9.3 Submission of a report does not guarantee investigation or any particular outcome.

10. PATRIOTIC OFFICERS REGISTER

10.1 The Patriotic Officers register is a public reference only.

10.2 It does not gate, approve, review, or restrict any Service feature.

11. INTELLECTUAL PROPERTY

11.1 The Service, including the PLU name, logo, design, and content, is the property of PLU or its licensors.

11.2 You are granted a limited, non-exclusive, revocable, non-transferable licence to use the Service for personal, non-commercial purposes consistent with these Terms.

12. USER-GENERATED CONTENT

12.1 You retain ownership of any content you submit.

12.2 You grant PLU a worldwide, royalty-free licence to use, reproduce, and display your content solely to operate and improve the Service.

12.3 You warrant that your content does not infringe third-party rights or violate law.

13. PRIVACY

Our Privacy Policy [link] forms an integral part of these Terms.

14. DISCLAIMERS

14.1 THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE".

14.2 TO THE MAXIMUM EXTENT PERMITTED BY UGANDAN LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

14.3 We do not warrant that the Service will be uninterrupted, error-free, or secure against all threats.

15. LIMITATION OF LIABILITY

15.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, PLU IS NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, USE, OR GOODWILL.

15.2 OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS IS LIMITED TO ONE HUNDRED THOUSAND UGANDAN SHILLINGS (UGX 100,000).

15.3 Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded by Ugandan law.

16. INDEMNITY

You agree to indemnify and hold PLU harmless from any claim arising from your breach of these Terms or your misuse of the Service.

17. TERMINATION

17.1 You may stop using the Service at any time and request deletion of your data.

17.2 We may suspend or terminate your access if you materially breach these Terms, if required by law, or if necessary to protect the Service or other users.

17.3 Sections 11, 14, 15, 16, 19, and 20 survive termination.

18. CHANGES TO THE SERVICE OR TERMS

18.1 We may modify the Service or these Terms. Material changes will be notified in-app and by email (if provided) at least 30 days before taking effect.

18.2 Continued use after the effective date constitutes acceptance.

19. GOVERNING LAW AND DISPUTE RESOLUTION

19.1 These Terms are governed by the laws of the Republic of Uganda.

19.2 Disputes shall first be attempted to be resolved amicably. If unresolved within 30 days, they shall be referred to the courts of Uganda.

20. GENERAL

20.1 Severability - If any provision is held invalid, the remaining provisions remain in full force.

20.2 Waiver - Our failure to enforce a provision is not a waiver.

20.3 Entire Agreement - These Terms and the Privacy Policy constitute the entire agreement between you and PLU.

20.4 Assignment - You may not assign these Terms; we may assign them to a successor entity.

21. CONTACT

Patriotic League of Uganda
Plot 7 Saddler Lane, Naguru, Kampala, Uganda
Email: ${SUPPORT_EMAIL}
Telephone: 0414675689

⚠ PROTOTYPE NOTICE
These Terms are prototype content prepared under Blueprint §4.3 and §16. They require PLU Legal Counsel review and formal adoption by the PLU Secretariat before public launch.`,
  },

  cookie: {
    title: "Cookie Policy",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

This Cookie Policy explains how PLU Mobi uses cookies and similar technologies, consistent with the Uganda Data Protection and Privacy Act 2019 and, for EEA users, the ePrivacy Directive (2002/58/EC as amended) and GDPR.

1. WHAT ARE COOKIES

Cookies are small text files stored on your device when you visit a website. They enable the site to remember your actions and preferences over time.

2. CATEGORIES WE USE

2.1 Strictly Necessary (no consent required)
- Session token - maintains your authenticated session.
- CSRF token - protects against cross-site request forgery.
- Load balancer - routes requests to the correct server.

2.2 Functional (consent required)
- Language preference (en, lg, sw) - remembers your chosen language.
- Theme preference - light/dark mode if enabled.
- Last visited page - improves navigation.

2.3 Analytics (consent required)
- Aggregated, anonymised usage statistics - helps improve the Service.
- No personal identifiers are linked.

3. WHAT WE DO NOT USE

We do not use:
- advertising or targeting cookies;
- third-party tracking pixels;
- social media tracking cookies;
- cross-site profiling;
- session recording (e.g., Hotjar, FullStory).

4. HOW TO MANAGE COOKIES

4.1 In-app
A consent banner appears on first visit, allowing you to accept or reject optional cookies.

4.2 Browser
You can clear and block cookies in your browser settings. Blocking strictly necessary cookies prevents sign-in.

4.3 Withdrawing Consent
You can withdraw consent at any time via the in-app cookie banner or by contacting ${DPO_EMAIL}.

5. RETENTION

- Session cookies: deleted when you close the browser.
- Functional cookies: up to 12 months.
- Analytics cookies: up to 24 months (anonymised).

6. THIRD-PARTY SERVICES

If we introduce third-party services (e.g., error monitoring), they will be listed here with purpose, retention, and opt-out links. Currently: none.

7. CHANGES

We will update this Policy when we introduce new cookie categories. The "Last updated" date reflects the current version.

8. CONTACT

Data Protection Officer: ${DPO_EMAIL}

⚠ PROTOTYPE NOTICE
This Policy requires PLU Legal Counsel sign-off and a fully implemented consent management platform (CMP) before public launch.`,
  },

  accessibility: {
    title: "Accessibility Statement",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

The Patriotic League of Uganda is committed to ensuring digital accessibility for all Ugandans, including people with disabilities.

1. CONFORMANCE STATUS

PLU Mobi aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, maintained by the World Wide Web Consortium (W3C). We are actively working toward full conformance.

2. MEASURES TAKEN

2.1 Structure
- Semantic HTML5 landmarks (header, nav, main, footer, article, section).
- Logical heading hierarchy (single h1 per page).
- Language attribute set per page.

2.2 Keyboard Accessibility
- All interactive controls are focusable and operable by keyboard.
- Visible focus indicators on every focusable element.
- Skip-to-content link on every page.
- No keyboard traps.

2.3 Visual Design
- Colour contrast meets or exceeds WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Text resizes up to 200% without loss of content or functionality.
- No content that flashes more than three times per second.
- Responsive down to 320px width.

2.4 Screen Readers
- Meaningful alternative text for all informative images.
- ARIA labels on icon-only buttons.
- Live regions for dynamic status updates (e.g., form submission).
- Form fields programmatically associated with labels and error messages.

2.5 Forms
- Clear, visible labels.
- Error messages identify the field and how to fix it.
- Autocomplete attributes where appropriate.

3. KNOWN LIMITATIONS

We are actively working to address:
- Some legacy screens may not fully meet AA.
- Complex data tables may benefit from additional ARIA on future iteration.
- PDF documents (if any) may not be fully tagged.
- Video captions are in progress for all media.

4. COMPATIBILITY

PLU Mobi is designed to work with:
- Current versions of Chrome, Firefox, Safari, and Edge.
- Mobile browsers on Android 9+ and iOS 13+.
- Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android).
- Zoom and text-spacing tools.

5. ASSISTIVE TECHNOLOGY TESTING

Manual testing with NVDA and VoiceOver is conducted for key user journeys (registration, sign-in, verification). Automated testing (axe-core via jest-axe) runs on every build for core components.

6. FEEDBACK AND CONTACT

We welcome your feedback on accessibility. Please contact:
Email: accessibility@plu-mobi.ug
Phone: 0414675689 (ask for the Accessibility Officer)
Postal: ${CONTROLLER}

We aim to respond within 5 business days.

7. ENFORCEMENT

If you are not satisfied with our response, you may escalate to the PLU Secretariat or, in the EEA, to your national enforcement body.

8. FORMAL CONFORMANCE STATEMENT

A formal WCAG 2.1 AA conformance statement (including a table of individual success criteria) will be published with the public launch of the Service.

⚠ PROTOTYPE NOTICE
This statement is prototype content prepared under Blueprint §2.2 and §17. It will be superseded by a formal conformance statement before public launch.`,
  },

  security: {
    title: "Security Statement",
    content: `Effective: ${LAST_UPDATED} · Version: ${VERSION}

The Patriotic League of Uganda treats the security of PLU Mobi as foundational. This statement describes our security posture and commitments.

1. SCOPE

This statement covers:
- the PLU Mobi web and mobile app,
- backend APIs and databases,
- associated infrastructure,
- user data within the Service.

2. SECURITY CONTROLS

2.1 Encryption
- All data in transit is protected with TLS 1.2 or higher. HSTS is enforced.
- All data at rest is encrypted in the database (AES-256 or equivalent).
- Backups are encrypted.

2.2 Authentication and Authorisation
- Sign-in requires phone or email plus a 6-digit PIN.
- PINs are hashed with bcrypt using OWASP-recommended salt rounds (minimum 12).
- Sessions use signed JWT tokens with short expiry and revocation.
- Role-based access control (member, reviewer, admin).
- Review actions require reviewer or admin role.
- No SMS-based authentication; no paid SMS dependency.

2.3 Application Security
- Helmet security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy).
- Rate limiting on all authentication and write endpoints.
- Input validation (Zod schemas) at the API boundary.
- Parameterised database queries (Prisma ORM) to prevent SQL injection.
- CSRF tokens for state-changing requests.
- No sensitive data in URLs; PII never in query strings.

2.4 Data Protection by Design
- Data minimisation (only collect what is necessary).
- Sensitive data (NIN) is used only for deduplication, never published.
- No biometric data, no background location, no advertising IDs.

2.5 Logging and Monitoring
- Immutable audit log for sensitive actions (registration, sign-in, endorsement, review, admin changes).
- Anomaly detection for unusual sign-in patterns.
- Logs do not contain PINs, tokens, or other secrets.

2.6 Vendor Management
- All infrastructure providers are contractually bound to appropriate security standards.
- Data processing agreements in place (see Privacy Policy).

3. INCIDENT RESPONSE

3.1 Detection
We monitor for indicators of compromise and respond to alerts.

3.2 Containment and Eradication
Affected systems are isolated; root cause is identified and remediated.

3.3 Notification
If a data breach affects personal data, we will notify the Uganda Personal Data Protection Office without undue delay and, where feasible, within 72 hours (DPPA 2019 §23; GDPR Art. 33), and notify affected users as required.

4. RESPONSIBLE DISCLOSURE

If you discover a vulnerability, please report it to security@plu-mobi.ug before public disclosure. We will acknowledge within 2 business days and aim to remediate critical issues within 30 days.

5. USER RESPONSIBILITIES

Help us keep your account secure:
- Never share your PIN - not even with PLU staff.
- Sign out on shared devices.
- Report suspicious messages to security@plu-mobi.ug.

6. CONTINUOUS IMPROVEMENT

We periodically review security controls against evolving threats and update this statement as needed.

7. CONTACT

Security Team: security@plu-mobi.ug
Postal: ${CONTROLLER}

⚠ PROTOTYPE NOTICE
This statement is prototype content prepared under Blueprint §15. A formal information security management framework (aligned to ISO/IEC 27001 or equivalent) and an independent security assessment are recommended before public launch.`,
  },

  faq: {
    title: "Frequently Asked Questions",
    content: `Q: Is registration free?
A: Yes, always. There is no fee to register, verify, endorse, or assist.

Q: Do I need a Patriotic Officer to join?
A: No. Anyone can register themselves or help a friend. No officer gate exists anywhere in the Service.

Q: How do I reset my PIN?
A: Click "Forgot PIN" on the sign-in page. A reset token will be emailed to you if you have an email on file. A cadre number alone cannot reset the PIN - you need email or phone verification.

Q: Can I help someone else register?
A: Yes. Sign in and click "Help register" on your dashboard. You will need their informed consent and accurate information. This is a normal capability recorded in the audit log - not a privilege.

Q: How do I verify a membership?
A: Open the Verify page and enter a PC number, or scan the QR code on any digital card. Verification returns only permitted public fields (name, PC number, status, pathway, district/country).

Q: Does the app work offline?
A: Yes - the Service is designed to operate offline-first. Public content is cached; registration and endorsement drafts are queued and synchronised when connectivity returns. Pending and last-synced status are always visible.

Q: How do I install PLU Mobi on my phone?
A: Open the site in your browser and tap "Add to Home Screen" (iPhone) or "Install app" (Android). It will behave like a native app.

Q: Who can see my NIN?
A: Only PLU administrators with a documented need, and only for private deduplication of endorsements. Your NIN is never published or shared.

Q: Can I delete my data?
A: Yes. Go to "My Data" in your dashboard and click "Request deletion". You can also email ${DPO_EMAIL}. Deletion is completed within 30 days.

Q: What if I find a bug or security issue?
A: Report to security@plu-mobi.ug. We acknowledge within 2 business days and aim to remediate critical issues within 30 days.

Q: How is my PIN protected?
A: Your PIN is hashed using bcrypt with at least 12 salt rounds. We never store or transmit it in plain text.

Q: What languages are supported?
A: Currently English. Luganda and Swahili are planned for later phases.

Q: Is this a prototype?
A: Yes. PLU Mobi is currently in prototype mode under the open participation model. Features labelled "simulated" are clearly marked; nothing is presented as live operation that is not.

⚠ PROTOTYPE NOTICE
FAQ content will be expanded before public launch based on user feedback.`,
  },
};

export default function LegalPage({ type }) {
  const nav = useNavigate();
  const page = pages[type] || pages.about;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-black/5">
        <img
          src="/plu-logo-circle.png"
          alt="PLU"
          className="h-10 w-10 rounded-full object-cover border-2 border-plu-yellow"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-extrabold text-plu-black">PLU Mobi</span>
          <span className="text-[10px] text-plu-yellow font-semibold">Patriotic League of Uganda</span>
        </div>
      </div>
      <BigButton variant="outline" onClick={() => nav(-1)}>⬅️ Back</BigButton>
      <div className="bg-white rounded-card p-6 space-y-3">
        <h1 className="text-2xl font-bold">{page.title}</h1>
        <p className="text-sm text-plu-slate whitespace-pre-line leading-relaxed">{page.content}</p>
      </div>
    </div>
  );
}
