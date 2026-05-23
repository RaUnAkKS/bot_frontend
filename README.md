# VoiceBot AI - Frontend 🎙️

This is the frontend user interface for **VoiceBot AI**. It is a modern, responsive, and mobile-first web application built with React and Tailwind CSS. It connects to the VoiceBot Django backend to provide a seamless voice-activated conversational AI experience.

## 🚀 Tech Stack

- **Framework:** React 18 (built with Vite for ultra-fast HMR)
- **Styling:** Tailwind CSS (Custom themes, glassmorphism, animations)
- **Speech-to-Text:** Web Speech API (`SpeechRecognition`)
- **Text-to-Speech:** Web Speech API (`speechSynthesis`)
- **API Client:** Axios
- **Deployment:** Vercel

## ⚡ Features

- **Continuous Voice Recording:** Animated microphone button with glowing pulse effects while listening.
- **Review Transcript:** Automatically pauses when you stop speaking, allowing you to review your transcript before sending, or cancel it.
- **Interruptible Bot:** Click the microphone while the bot is speaking to instantly stop it and start a new recording.
- **History Sidebar:** ChatGPT-style collapsible sidebar that fetches and saves all your past conversations.
- **Bilingual TTS Engine:** Automatically falls back to Indian-English/Hindi voices for a natural-sounding response.
- **Dark Mode:** A sleek, fully integrated dark theme with automatic preference detection.

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   git clone https://github.com/RaUnAkKS/bot_frontend.git
   cd bot_frontend

2. **Install dependencies:**
   npm install

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and point it to your backend:
   VITE_API_URL=http://localhost:8000
   (Or use your deployed Render URL for production)

4. **Start the Development Server:**
   npm run dev
   
   (The application will be available at http://localhost:5173)

## 🌍 Deployment (Vercel)

This project is optimized for deployment on Vercel.
1. Import the repository into your Vercel dashboard.
2. Vercel will automatically detect that it is a **Vite** project.
3. Add your `VITE_API_URL` (pointing to your live Render backend) in the Vercel Environment Variables settings.
4. Click **Deploy**.

## 🎨 UI Architecture

- `App.jsx` - The main orchestrator connecting state, the chat window, and the sidebar.
- `VoiceRecorder.jsx` - Handles the complex UI logic for recording, pausing, resuming, and animated waveforms.
- `useSpeechRecognition.js` - Custom hook protecting against duplicate browser STT triggers.
- `index.css` - Contains the custom CSS keyframes required for the fluid UI micro-animations.
