<div align="center">

# 🎙️ AWAAZ — *Haq Mitra* (हक मित्र)
### *"My Rights Friend"*

**A voice-first, vernacular AI casework platform that connects India's marginalized citizens to the government welfare schemes they already qualify for.**

[![Status](https://img.shields.io/badge/status-prototype-orange)]()
[![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)]()
[![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)]()
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)]()

</div>
## https://awaz-mitra.netlify.app/

---

## 📖 Overview

Millions of rural and low-income families across India are *eligible* for welfare schemes — income support for farmers, free health insurance, widow and senior pensions, maternity benefits — but never receive them, simply because they don't know the schemes exist or can't navigate the paperwork to apply.

**AWAAZ ("Haq Mitra")** closes that gap. A citizen sends a voice note in their own language — Hindi, Marathi, Tamil, Telugu, or Bengali — over WhatsApp, describing their life in their own words. The AI listens, extracts the demographic and economic details that matter (age, income, land, occupation, pregnancy status), matches them instantly against a database of central and state welfare schemes, and hands a local caseworker a ready-to-verify checklist and a pre-filled application form.

This repository is a **fully interactive, self-contained prototype** of that experience — a WhatsApp simulator, a caseworker dashboard, and a scheme database explorer, all running entirely in the browser.

---

## 🚀 Key Features

### 1. Conversational Voice Sandbox (WhatsApp Simulation)
- **Voice-first interaction** — a simulated WhatsApp chat interface using the native Web Speech API for speech-to-text and text-to-speech across several Indian languages.
- **Preloaded demo scenarios** — click-and-play citizen profiles: a farmer in UP (Hindi), a widowed domestic helper in Maharashtra (Marathi), and a tailor in Tamil Nadu (Tamil).
- **Live AI entity extraction** — watch demographic variables (age, state, income, land ownership, pregnancy status, occupation) get parsed out of the conversation in real time.
- **Dynamic scheme matching** — citizens are matched against the live schemes database as the conversation progresses.

### 2. Caseworker Management Dashboard
- **Citizen case directories** — a repository of active case files where local volunteers ("Haq Mitras") can edit demographics, phone numbers, and bank details.
- **Document verification checklist** — an interactive checklist mapping required paperwork (Aadhaar, Land Patta, Ration Card, MCP card, etc.) to a verification status.
- **Pre-filled government application forms** — auto-generates a clean, official-style application layout, pre-filled with all relevant demographic, banking, and scheme-specific data.
- **One-click A4 printing** — custom `@media print` styling renders application forms and checklists straight to paper, automatically hiding all dashboard UI, sidebars, and navigation.

### 3. Scheme Explorer & Calculators
- **Scheme database hub** — metadata for 10 major central and state schemes, including PM-KISAN, Ayushman Bharat (PM-JAY), PMAY-G, PMUY, Atal Pension Yojana, and state pension programs.
- **Quick eligibility calculators** — tweak inputs (age, income, BPL status, occupation, state) inside any scheme card and instantly test eligibility against that scheme's rules.
- **Category filters and search** — browse by sector (Agriculture, Healthcare, Pension, Housing, Women & Child) or search by name, ministry, or benefit.

---

## 🖼️ Screenshots

<table>
<tr>
<td width="50%">

**Home — Landing Page**
<img width="1918" height="908" alt="01-home png" src="https://github.com/user-attachments/assets/ca8cf76b-7218-4901-b9f5-1215af765ec5" />


**WhatsApp Sandbox**
<img width="1917" height="915" alt="02-whatsapp-sandbox png" src="https://github.com/user-attachments/assets/f946e728-d8e4-432d-aed7-c84b128f4263" />

**Caseworker Portal**
<img width="1913" height="906" alt="03-caseworker-portal png" src="https://github.com/user-attachments/assets/fcd8aedc-663a-4451-bf06-3c05c915e6e9" />

**Scheme Explorer**
<img width="1915" height="898" alt="04-scheme-explorer png" src="https://github.com/user-attachments/assets/4d3ee9f6-9e50-4651-b6c1-4373693738a7" />

</table>

---

## 📂 Project Architecture

The project is a self-contained, lightweight single-page application (SPA) with **zero external package installations** — pure HTML, CSS, and vanilla JavaScript.

```
awaaz-haq-mitra/
├── index.html            # Structural grids, phone-mockup chat canvas,
│                          # dashboard sidebars, and A4 print preview layout
├── styles.css             # Responsive layout, glassmorphism UI, dark/light
│                          # theme variables, animations, and print overrides
├── schemes.js             # Welfare scheme metadata + eligibility-rule engine
├── whatsapp_engine.js     # Speech recognition/synthesis, translation mocks,
│                          # entity parsing, and dialogue trees
├── dashboard.js           # Case file database, checklist state, and
│                          # form/HTML layout generation
└── app.js                 # Mounts all controllers, binds events, routes
                            # tabs, and updates visual state
```

| File | Responsibility |
|---|---|
| `index.html` | Page structure: navigation, WhatsApp phone mockup, caseworker dashboard, scheme explorer |
| `styles.css` | All visual styling — glassmorphism cards, theming, responsive grids, print rules |
| `schemes.js` | The welfare schemes database and per-scheme eligibility-checking logic |
| `whatsapp_engine.js` | Voice recognition/synthesis, mock translation, entity extraction, conversation flow |
| `dashboard.js` | Case file storage, document checklist logic, application form generation |
| `app.js` | Application bootstrap — tab routing, event binding, theming, language switching |

---

## 🛠️ How to Run Locally

Because the application is written entirely in client-side HTML, CSS, and JavaScript, **no build step, package manager, or server is required.**

1. Clone or download this repository.
2. Navigate to the `awaaz-haq-mitra/` directory.
3. Open `index.html` in a web browser — **Google Chrome is recommended** for full support of microphone recording, Speech Recognition, and Speech Synthesis.
4. Use **Launch WhatsApp Sandbox** or **Caseworker Portal** from the home screen to explore the live tabs.

```bash
git clone <repo-url>
cd awaz_haq_mitra/awaaz-haq-mitra
# then simply open index.html in your browser, e.g.:
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

## 🔮 Roadmap / Next Steps

- **WhatsApp API integration** — connect the conversational engine to real phone numbers via Twilio or the official WhatsApp Business API.
- **True LLM & voice-translation APIs** — replace client-side mocks with Bhashini (India's national language translation protocol) or Whisper/Gemini-class models for accurate local-dialect transcription and entity parsing.
- **OCR document verification** — let citizens photograph their Aadhaar or Ration Card over WhatsApp, with automatic detail extraction and verification.
- **Offline mode** — allow caseworkers to cache client profiles in browser IndexedDB when visiting remote villages with poor connectivity.

---

## 🤝 Contributing

This is currently a prototype/demo project. Issues, ideas, and pull requests that improve scheme coverage, accessibility, or vernacular support are welcome.

## 📄 License

No license has been specified for this project yet. Please contact the maintainers before reuse in production.
