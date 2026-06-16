# 🌗 Resume Copilot AI
> **Stop guessing what the ATS wants. Let the AI build it.**

<p align="center">
  <a href="https://www.atsai.pro" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-www.atsai.pro-000000?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/sabledattatray/Resume-Copilot-AI/stargazers">
    <img src="https://img.shields.io/github/stars/sabledattatray/Resume-Copilot-AI?style=for-the-badge&logo=github&color=gold" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/sabledattatray/Resume-Copilot-AI/issues">
    <img src="https://img.shields.io/github/issues/sabledattatray/Resume-Copilot-AI?style=for-the-badge&logo=github&color=red" alt="GitHub Issues" />
  </a>
  <a href="https://github.com/sabledattatray/Resume-Copilot-AI/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
  </a>
</p>

---

## 🚀 One-Click Quick Deployments

Deploy your own private instance of Resume Copilot AI instantly to your preferred hosting provider:

<p align="left">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsabledattatray%2FResume-Copilot-AI" target="_blank">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" height="36" />
  </a>
  <a href="https://render.com/deploy?repo=https://github.com/sabledattatray/Resume-Copilot-AI" target="_blank">
    <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="36" />
  </a>
</p>

---

## 🪐 About the Project

**Resume Copilot AI** is a premium, full-stack Resume Parsing, ATS (Applicant Tracking System) Simulation, and Career Management Workspace. Powered by Google's **Gemini 2.5 Flash API**, the platform simulates enterprise-level recruitment screeners to evaluate resume readability, identify critical keyword gaps, provide STAR-formatted bullet rewrites, and render print-ready, high-fidelity PDF layouts.

---

## 📸 Visual Showcase

| **ATS Scoring & Matcher** | **Tailored Cover Letter Generator** |
| :---: | :---: |
| ![Analysis Dashboard](./public/dashboard.png) | ![Sign In Page](./public/signin_page.png) |

| **System Admin Portal** | **Authentication Gate** |
| :---: | :---: |
| ![Admin Panel](./public/admin_panel.png) | ![Pricing Page](./public/pricing_page.png) |

---

## 🛠️ System Architecture

The following diagram illustrates the data flow and integration topology of the Resume Copilot AI platform:

```mermaid
graph TD
    Client[React/Vite SPA Client] -->|1. Multer PDF Upload + JD Text| Server[Express Backend Server]
    Server -->|2. PDF Text Extraction| PDFParse[pdf-parse Engine]
    PDFParse -->|3. Clean Text + JD| Gemini[Gemini 2.5 Flash API]
    Gemini -->|4. Structure Analysis & STAR Bullet Rewrites| Server
    Server -->|5. JSON Results| Client
    Client -->|6. Render PDF Template| PDFExport[High-Fidelity PDF Exporter]
    Client -->|7. Secure Auth| Firebase[Firebase Auth / Google & GitHub]
    Client -->|8. Payment/Credit Provisioning| Razorpay[Razorpay Gateway]
    
    style Client fill:#0f172a,stroke:#6366f1,stroke-width:2px,color:#fff
    style Server fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff
    style Gemini fill:#1e1b4b,stroke:#c084fc,stroke-width:2px,color:#fff
```

---

## 🌟 Core Features

### 🔍 ATS Simulator & AI Scoring
* **HR Parsing Simulation:** Simulates how major applicant tracking systems (Workday, Greenhouse, Lever) scan and score your resume structure.
* **Semantic Keyword Matching:** Compiles keywords from target Job Descriptions and audits your resume's experience rows to identify critical vs. optional keyword coverage.
* **AI Bullet Rewrites:** Leverages the STAR method (Situation, Task, Action, Result) to automatically rewrite weak achievements, sprinkling in missing skills naturally.

### ✍️ Professional Editor & Document Exporter
* **Multiple Layout Templates:** Select from Creative, Tech, Academic, and Executive formats.
* **Cover Letter Builder:** Generates tailored, role-specific cover letters matched to the job description and your resume experience, supporting dynamic light/dark theming.
* **High-Fidelity PDF Export:** Downloads clean A4 PDF layouts without page overflows, duplicate blank pages, or SVG baseline overlaps.

### 🔐 Secure Multi-Provider Authentication
* **OAuth Login Support:** Seamlessly authenticate via Google or GitHub popup windows.
* **Email & Password Authentication:** Allows standard credential registration and password changes.
* **Email Verification Gate:** Enforces account activation. Unverified email/password accounts are stopped by a fullscreen lockout gate where they can resend verification links or refresh session states in real-time.

> [!NOTE]  
> **Zero-Config Fallback Mode:** The application gracefully degrades to local mock sessions if Firebase environment credentials are missing, enabling immediate preview/development testing.

### 🛠️ System Admin Portal
* **User Database:** View a complete, paginated directory of all registered users, their login providers, creation dates, and email verification status.
* **User Credit Manager:** Search users by name/email and dynamically adjust scan credits (`+10 Credits` / `-10 Credits`) to manage access.
* **Local Database Storage:** Automatically synchronizes authenticated user sessions to a local backend storage file (`users.json`) on the fly.

---

## 💻 Tech Stack

* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend Runtime:** Node.js, Express (serving proxy endpoints, payment hooks, and SPA routing)
* **Auth & Session Security:** Firebase client SDK v9+
* **AI Engine:** Google Gemini 2.5 Flash SDK (`@google/genai`)
* **Payment Gateway:** Razorpay (including webhooks for credit provisioning)
* **File Processing:** `pdf-parse`, `multer`

---

## 🚀 Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sabledattatray/Resume-Copilot-AI.git
cd Resume-Copilot-AI
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and configure the following keys:

```env
# Server Port (default is 3000)
PORT=3000

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web App client configuration keys
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Razorpay credentials (falls back to mock payment if keys are default test keys)
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Setup Firebase Console Sign-In Providers
To enable auth methods for your project:
1. Go to your [Firebase Console](https://console.firebase.google.com/) and navigate to **Authentication** > **Sign-in method**.
2. **Email/Password**: Click Email/Password, toggle **Enable**, and save.
3. **Google**: Click Google, toggle **Enable**, select your support email, and save.
4. **GitHub**:
   * Register a new OAuth App in your [GitHub Developer Settings](https://github.com/settings/developers).
   * Copy the Authorization callback URL from the Firebase GitHub configuration dialog and paste it into GitHub.
   * Paste your GitHub **Client ID** and **Client Secret** back into the Firebase console and click save.

### 4. Run the Application
Start the development backend proxy and React server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> [!TIP]  
> In local development, if you sign up using email/password and do not want to wait for email delivery, a **"Bypass Verification (Local Dev Mode)"** button will appear on the lockout screen to let you instantly activate your test accounts.

---

## 📦 Production Bundling

To compile an optimized build bundle:
```bash
npm run build
```
This builds static client assets in `/dist` and bundles the Node API runtime to `/dist/server.cjs`.

---

## 👨‍💻 Author & Connect

**Built by Datta Sable**  
*AI Systems Architect • SaaS Builder • Web & Automation Developer*

* **GitHub:** [@sabledattatray](https://github.com/sabledattatray)
* **Website:** [dattasable.com](https://dattasable.com)
* **LinkedIn:** [Datta Sable](https://linkedin.com/in/dattasable)
* **Email:** [contact@dattasable.com](mailto:contact@dattasable.com)
