# 🤖 AI-Powered Interactive Portfolio

[**Live Demo: chat-with-ali.onrender.com**](https://chat-with-ali.onrender.com)

A next-generation, **chat-first portfolio website** where visitors interact with an AI persona of the developer. Built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, and the **Vercel AI SDK**.

This project transforms the traditional static portfolio into an engaging, conversational experience. Instead of just browsing, users can ask questions like *"What projects have you worked on?"* or *"Do you have experience with Python?"* and receive intelligent, context-aware responses alongside rich UI widgets.

---

## ✨ Features

- **💬 Conversational UI:** A full-screen chat interface powered by Large Language Models (LLMs) via Groq.
- **🧠 Context-Aware AI:** The AI "knows" your resume, skills, and projects and answers questions as *you*.
- **🧩 Rich UI Widgets:** The AI can render interactive components (Tools) within the chat stream:
  - 📂 **Projects Showcase**
  - 📄 **Resume Preview & Download**
  - 🛠️ **Skills Overview**
  - 📅 **Contact & Availability**
  - 🎓 **Education & Experience**
- **⚙️ 100% Configurable:** Entirely driven by a single `portfolio-config.json` file. No code changes needed to update content.
- **⚡ Blazing Fast:** Built on Next.js 15 with Turbopack and React Server Components.
- **🎨 Modern Design:** Styled with Tailwind CSS 4, Framer Motion animations, and Radix UI primitives.
- **🌓 Dark/Light Mode:** Seamless theme switching with `next-themes`.
- **📱 PWA Ready:** Fully responsive with mobile install support (Manifest, Touch Icons).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Engine:** [Vercel AI SDK](https://sdk.vercel.ai/) + [Groq API](https://groq.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Sonner](https://sonner.emilkowal.ski/), [Lucide React](https://lucide.dev/)
- **Markdown:** `react-markdown` with GFM support

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A [Groq API Key](https://console.groq.com/keys) (Free tier available)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see your AI portfolio in action.

---

## ⚙️ Configuration

You can personalize the entire portfolio **without touching the code**.
Open `portfolio-config.json` in the root directory and update the fields:

- **`personal`**: Your name, bio, title, and social links.
- **`education`**: Your degree, university, and achievements.
- **`experience`**: Work history and internships.
- **`skills`**: Categorized lists of your technical skills.
- **`projects`**: Your portfolio projects with descriptions, tech stacks, and links.
- **`chatbot`**: Customize the AI's name, personality, tone, and initial greeting.
- **`presetQuestions`**: The quick-reply bubbles shown to users.

**Example `portfolio-config.json` snippet:**
```json
{
  "personal": {
    "name": "Md Ali Khan",
    "title": "AI/ML Engineer",
    "bio": "Building intelligent systems..."
  },
  "chatbot": {
    "name": "Ali",
    "personality": "professional yet friendly",
    "tone": "enthusiastic"
  }
}
```

---

## 📦 Build & Deployment

To create a production build:

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/):

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Add the `GROQ_API_KEY` in the Vercel **Environment Variables** settings.
4.  Deploy!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Md Ali Khan](https://portfolio.mdalikhan.com)