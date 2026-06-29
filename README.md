AWAAZ — "Haq Mitra" (My Rights Friend)
AWAAZ ("Haq Mitra") is an interactive, voice-first AI casework platform designed to bridge the awareness and implementation gap between India's marginalized citizens and the government welfare schemes they are eligible for.

Millions of rural and low-income families in India qualify for welfare schemes (such as agricultural income support, free health insurance, pensions, or maternal benefits) but remain unaware of their existence or struggle to navigate complex application procedures. AWAAZ enables these citizens to describe their life situation naturally via voice notes in their native tongue (Hindi, Tamil, Marathi, Telugu, Bengali) over WhatsApp, automatically maps their eligibility, lists required documents, and drafts pre-filled application forms.

🚀 Key Features
1. Conversational Voice Sandbox (WhatsApp Simulation)
Voice-First Interaction: Simulates a WhatsApp chat interface with native Web Speech API recognition (Speech-to-Text) and synthesis (Text-to-Speech) supporting multiple Indian vernaculars.
Preloaded Demo Scenarios: Click-and-play profiles representing a farmer in UP (Hindi), an elderly widow helper in Maharashtra (Marathi), and a tailor in Tamil Nadu (Tamil).
AI Entity Extraction: Shows live parsing of demographic variables (Age, State, Income, Land ownership, Pregnancy status, Occupation) as the conversation progresses.
Matched Schemes List: Dynamically matches citizens against the schemes database in real-time.
2. Caseworker Management Dashboard
Citizen Case Directories: A repository of active case files where local helpers (Haq Mitras) can edit demographic inputs, phone numbers, and bank account information.
Document Verification Checklist: Interactive checklist mapping required papers (e.g. Aadhaar, Land Patta, Ration card, MCP card) to track verification status.
Prefilled Government Application Forms: Auto-generates a clean, official government application layout prefilled with all demographic, bank, and scheme-specific variables.
One-Click A4 Printing: Uses custom print styling (@media print in CSS) to render application forms and checklists directly onto physical paper from the browser's print dialog, automatically hiding all dashboard buttons, sidebars, and tab navigation.
3. Scheme Explorer & Calculators
Scheme Database Hub: Comprehensive metadata directory for major central and state schemes including PM-KISAN, Ayushman Bharat (PM-JAY), PMAY-G, PMUY, Atal Pension Yojana, and state pensions.
Quick Eligibility Calculators: Tweak values (Age, Income, BPL status) inside scheme cards to test eligibility parameters instantly.
📂 Project Architecture
The project is structured as a self-contained, lightweight single-page application (SPA) with zero external package installations:

index.html: Defines the structural grids, the phone mockup chat canvas, dashboard sidebars, and the A4 print preview layout.
styles.css: Features responsive layout styling, glassmorphism UI elements, dark/light theme variables, custom slide/pulse animations, and print media overrides.
schemes.js: Stores the metadata of Indian welfare schemes and their dynamic eligibility threshold validation algorithms.
whatsapp_engine.js: Operates speech recognition/synthesis triggers, translation mocks, parsing logic, and dialogue trees.
dashboard.js: Manages case files database, checklist statuses, and form HTML layout generations.
app.js: Mounts all controllers, binds event listeners, routes tab changes, and updates visual state.
🛠️ How to Run Locally
Because the application is written entirely in client-side HTML, CSS, and JavaScript, no compilation or server setup is required:

Clone or download the repository directory.
Locate the index.html file.
Open it in a web browser (Google Chrome is recommended for microphone recording, Speech Recognition, and Speech Synthesis support).
Tap Launch WhatsApp Sandbox or Caseworker Portal to explore the active tabs.
🔮 Roadmap / Next Steps
WhatsApp API Integration: Integrate Twilio or official WhatsApp Business API to connect the conversational engine to actual phone numbers.
True LLM & Voice translation APIs: Replace client-side mocks with Bhashini API (India's national language translation protocol) or Whisper/Gemini models for hyper-accurate local dialect transcription and entity parsing.
OCR Document Verification: Allow citizens to take photos of their Aadhaar or Ration Card via WhatsApp, automatically extracting details and checking if they are verified.
Offline Mode: Enable caseworkers to save client profiles in browser IndexedDB cache when visiting remote villages with low internet connectivity.
