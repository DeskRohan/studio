# NextGenSDE: Your Personalized Placement Preparation Hub

**NextGenSDE** is a modern, AI-powered web application designed to help computer science students streamline their preparation for software development placements. It provides a structured roadmap, personalized resources, and intelligent tools to keep users motivated and on track toward their career goals.

**Important Note:** This application runs entirely on the client-side. All user data (profile, progress, streak, roadmap) is stored in the browser's **local storage**. There is no backend database, meaning data is tied to the specific browser and device you use it on.

---

## ✨ Key Features

- **Personalized Dashboard:** A central hub that provides a quick overview of the user's progress, including topics completed, topics remaining, current day streak, and a visual consistency tracker.

- **Dynamic Study Roadmap:**
    - **Expert-Curated Plan:** A default 9-month, phase-by-phase roadmap covering essential DSA, core CS subjects, and development skills.
    - **Progress Tracking:** Users can check off completed topics and track the number of practice problems solved for each phase.
    - **AI Roadmap Generator:** Users can generate a new, personalized roadmap tailored to their specific timeline (e.g., "3 months").

- **AI-Powered Tools (Powered by Google's Gemini):**
    - **Niva (AI Doubt Solver):** A floating action button that opens an AI chat assistant to answer quick questions about DSA and other CS concepts.
    - **AI Interviewer:** A practice zone where users can answer common behavioral and technical interview questions and receive instant, constructive feedback.
    - **Learning Recommendations:** An AI-powered feature that analyzes a user's progress on the roadmap and suggests the weakest topics to focus on.

- **Curated Resources:** A handpicked collection of high-quality learning materials (YouTube playlists, articles, practice websites) for DSA, core CS subjects, and project development.

- **Question Bank:** A filterable and sortable list of curated practice problems from platforms like LeetCode, categorized by topic and difficulty.

- **Local-First Authentication:** Users create a local profile with a simple name and a 4-digit passcode, which is stored securely on their device.

- **Responsive & Modern UI:** Built with ShadCN UI and Tailwind CSS, featuring a clean design, dark/light mode, and subtle animations for a great user experience.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [React Hooks](https://reactjs.org/docs/hooks-intro.html) & Local Storage
- **AI/Generative UI:** [Google Gemini & Genkit](https://firebase.google.com/docs/genkit)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN/UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Folder Structure

The project follows a standard Next.js App Router structure with some key organizational choices:

```
src
├── ai
│   ├── flows/            # Genkit AI flows (server-side logic for Gemini)
│   └── genkit.ts         # Genkit configuration
├── app
│   ├── (app)/            # Authenticated routes (main application)
│   │   ├── dashboard/
│   │   ├── study-plan/
│   │   └── ...
│   ├── layout.tsx        # Root layout for the entire app
│   └── page.tsx          # Welcome/Login page (unauthenticated)
├── components
│   ├── dashboard/        # Components specific to the Dashboard page
│   ├── study-plan/       # Components specific to the Study Plan page
│   ├── ui/               # Reusable UI components from ShadCN
│   └── ...               # Other shared components (header, footer, etc.)
├── hooks/                # Custom React hooks (e.g., use-toast)
├── lib/                  # Utility functions, data constants, etc.
└── styles/
    └── globals.css       # Global styles and Tailwind CSS configuration
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nextgensde.git
cd nextgensde
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This project uses Google's Generative AI (Gemini). You need to get an API key to use the AI features.

1.  Create a `.env` file in the root of the project.
2.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the key to your `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:9002`.

---

## 🚢 Deployment

You can deploy this Next.js application to any platform that supports Node.js. Here are the recommended options:

### Vercel (Recommended)
1.  Push your code to a Git repository (GitHub, GitLab, etc.).
2.  Sign up and import your project on [Vercel](https://vercel.com/).
3.  In the Vercel project settings, add your `GEMINI_API_KEY` as an environment variable.
4.  Vercel will automatically build and deploy your app.

### Netlify
1.  The project contains a `netlify.toml` file, so it's ready for Netlify.
2.  Push your code to a Git repository.
3.  Sign up and import your project on [Netlify](https://www.netlify.com/).
4.  Add your `GEMINI_API_KEY` as an environment variable in the site settings.
5.  Netlify will handle the rest.

---

## 💡 Important Architectural Notes

- **Local Storage as a Database:** All user-specific data (profile, roadmap, streaks, progress) is stored in the browser's local storage. This means that all data is confined to the device and browser it was created on. It will not sync across devices.
- **AI on the Server (Side):** The AI logic is handled by Next.js Server Actions via Genkit flows. These flows run on the server-side when called from the client, securely using the `GEMINI_API_KEY` from the environment variables.
- **Simple Passcode Authentication:** The app uses a simple passcode system. The passcode is stored in local storage, and authentication is managed on the client side. This is for demonstration purposes and is not a secure authentication method for a production application with sensitive data.
