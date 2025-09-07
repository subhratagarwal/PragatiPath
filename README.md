# PragatiPath: AI-Powered Civic Issue Reporting Platform

![PragatiPath Banner](https://img.shields.io/badge/PragatiPath-Community%20Powered%20Solutions-green)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API-orange?logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-Data%20Viz-blueviolet)
![License](https://img.shields.io/badge/License-MIT-yellow)

A mobile-first, citizen-centric platform that empowers communities to report and track civic issues. PragatiPath leverages AI-powered issue classification, real-time tracking, gamification, and interactive visualizations — all built as a modern, **frontend-only** web app.

---

## 🌟 Features

### For Citizens
- **AI-Powered Reporting**: Upload images or text — Gemini automatically categorizes and prioritizes issues.  
- **Real-time Tracking**: Track issue status (`Reported → Acknowledged → In Progress → Resolved`).  
- **Interactive Map & Charts**: Explore issues visually using maps and charts (powered by Recharts).  
- **Community Engagement**: Upvote issues, comment, and build collective awareness.  
- **Gamification**: Earn points, badges, and climb leaderboards for civic participation.  

### For Administrators
- **Dashboard Overview**: Summaries, charts, and timelines of reported issues.  
- **AI-Powered Prioritization**: Automatic classification and smart scoring for severity.  
- **Data Insights**: Filter issues by status, location, and priority.  

---

## 🚀 Quick Start (Frontend Only)

### Prerequisites

* Node.js 16+
* A Google AI Studio API Key (for Generative AI features)
* A Google Maps API Key (for maps integration)

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/pragatipath.git
   cd pragatipath
   ```

2. **Setup Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your keys:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api   # optional if you connect backend later
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
   VITE_GEMINI_API_KEY=your-google-ai-key
   ```

3. **Install Dependencies**

   ```bash
   npm install
   npm install recharts @google/generative-ai
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Access the App**

   * Open [http://localhost:5173](http://localhost:5173)

---
## 🏗️ Architecture & Tech Stack

* **Frontend**: React + TypeScript + Vite
* **Styling**: Tailwind CSS + Framer Motion (animations)
* **Data Viz**: Recharts (dashboards & charts)
* **AI**: Google Gemini API (`@google/generative-ai`)
* **State Management**: React Context API
* **Deployment**: Vercel / Netlify / GitHub Pages

### Project Structure

```
pragatipath/
├── components/     # Reusable React components (Navbar, IssueCard, etc.)
├── pages/          # Page-level components (Home, ReportIssue, Dashboard)
├── services/       # API & Gemini integration (geminiService.ts)
├── context/        # React context (Auth, Issues, etc.)
├── constants.ts    # Mock/demo data & constants
├── types.ts        # TypeScript type definitions
├── App.tsx         # Root application
├── index.tsx       # React entry point
├── vite.config.ts  # Vite configuration
└── README.md
```

---

## 🤖 AI Integration (Gemini)

* **Image-to-Description**: Converts uploaded images into concise text descriptions.
* **Automated Categorization**: AI assigns category & priority to issues.
* **Conversational Assistant**: Floating chatbot for real-time guidance.

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeIssue(image: File) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent([
    "Analyze this civic issue image:",
    image,
  ]);
  return result.response.text();
}
```

---

## 🎮 Gamification

* **Points System**: Earn rewards for reporting, upvoting, and resolving.
* **Badges**: Recognition for consistent and impactful reporting.
* **Leaderboards**: Weekly and monthly top contributors.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* Google Gemini API for AI capabilities
* Recharts for data visualizations
* Tailwind CSS & Framer Motion for design & animations
* React community for the ecosystem

```

---

👉 This way, your README matches the **second style** (professional, structured) but aligns with your **frontend-only, Gemini-powered app**.  

Do you also want me to add a **deployment guide (Netlify/Vercel)** so contributors/users can host their own version easily?
```
