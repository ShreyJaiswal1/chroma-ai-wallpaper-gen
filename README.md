<div align="center">
  <img src="assets/images/logo.png" alt="Chroma AI Logo" width="140" />

# ✨ Chroma AI Wallpapers

**Transform your screen with AI-crafted wallpapers — built for beauty, powered by intelligence.**

  <p>
    <a href="https://chroma.lazyshrey.in"><img src="https://img.shields.io/badge/🌐_Visit_Website-chroma.lazyshrey.in-8B5CF6?style=for-the-badge" alt="Website" /></a>
    <a href="https://discord.com/invite/ZVCB8EnRX2"><img src="https://img.shields.io/badge/Discord-Join_Lazy_Devs-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord Community" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <a href="https://pollinations.ai"><img src="https://img.shields.io/badge/Pollinations_AI-00C853?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSIzIi8+PGNpcmNsZSBjeD0iNiIgY3k9IjE2IiByPSIzIi8+PGNpcmNsZSBjeD0iMTgiIGN5PSIxNiIgcj0iMyIvPjwvc3ZnPg==&logoColor=white" alt="Pollinations AI" /></a>
    <a href="https://groq.com"><img src="https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJMMyAxOWgxOEwxMiAyeiIvPjwvc3ZnPg==&logoColor=white" alt="Groq" /></a>
  </p>

  <p>
    Create breathtaking, completely unique wallpapers generated instantly on your device via <a href="https://pollinations.ai">Pollinations AI</a>.<br/>
    Download directly to your gallery, curate your favorites, and elevate your phone's aesthetics.
  </p>
</div>

---

## 📸 Showcase

<p align="center">
  <img src="assets/images/preview1.png" width="30%" alt="Showcase - Generate Screen" />
  &nbsp;&nbsp;
  <img src="assets/images/preview2.png" width="30%" alt="Showcase - Gallery View" />
  &nbsp;&nbsp;
  <img src="assets/images/preview3.png" width="30%" alt="Showcase - Preview Screen" />
</p>

---

## ✨ Features

|     | Feature                     | Description                                                                                                                                                                            |
| --- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🎭  | **Style Presets**           | Choose from curated art styles — **Anime**, **Cinematic**, **Photorealistic**, **Digital Art**, **Fantasy**, **Minimalist**, and more — to shape the mood and look of every wallpaper. |
| 🪄  | **AI Idea Generation**      | Blanking on a prompt? Hit the magic dice icon to generate a highly detailed prompt based on professional mobile wallpaper aesthetics.                                                  |
| 🖼️  | **Curated Masonry Gallery** | Your generated history is beautifully presented in a buttery-smooth masonry grid layout.                                                                                               |
| ⚡  | **Supercharged Creation**   | Generation runs on ultra-fast inferences, and results appear in a frosted-glass canvas right on your screen.                                                                           |
| 💾  | **Local Persistence**       | Caches your recent 50 generated masterpieces automatically using `AsyncStorage`.                                                                                                       |
| 📥  | **Direct Save**             | One-button download instantly saves your creation to your device's native photos app.                                                                                                  |
| 🎨  | **Glassmorphic UI**         | Gorgeous blurred overlays, sweeping dark gradients, and custom curved bottom tabs.                                                                                                     |

---

## 📁 Project Architecture

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation layout
│   ├── gallery.tsx          # Masonry layout of historical creations
│   ├── generate.tsx         # The prompt studio & showcase canvas
│   └── settings.tsx         # App preferences & cache management
├── _layout.tsx              # Root routing configuration
├── index.tsx                # Animated splash entry point
└── preview.tsx              # Full-screen immersive detail view

src/
└── shared/
    └── ui/
        ├── base/
        │   ├── auto-trigger/       # Auto generation trigger
        │   ├── curved-bottom-tabs/ # Custom curved tab bar
        │   ├── insight-card/       # Stats & insight cards
        │   ├── prompt-input/       # Prompt text input
        │   ├── settings-row/       # Settings list row
        │   └── style-selector/     # Art style picker
        └── organisms/
            └── dialog/             # Reusable dialog modals

types/
└── react-native-manage-wallpaper.d.ts

utils/
└── imageService.tsx         # AI logic, local storage, API fetching
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have your environment set up for React Native / Expo:

- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (for testing on hardware) or iOS Simulator / Android Emulator.

### Environment Setup

Create a `.env` file at the root of the project with your API keys:

```env
EXPO_PUBLIC_POLLEN_API=your_pollinations_api_key_here
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### Installation

1. **Clone & Install**

   ```bash
   git clone <your-repo-url>
   cd ai-wallpaper-app
   npm install
   ```

2. **Start the Development Server**

   ```bash
   npm start
   ```

3. **Run**
   Scan the generated QR code in your terminal using the **Expo Go** app (or run it virtually).

---

## 🔌 API Integration

Chroma relies on [Pollinations AI](https://pollinations.ai) for image generation and Groq for prompt intelligence:

| Service                                    | Role                 | Details                                                                                            |
| ------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------- |
| [Pollinations AI](https://pollinations.ai) | 🖼️ Image Generation  | Generates 1024×1792 aspect-corrected mobile wallpapers — **completely free**, no API key required. |
| [Groq](https://groq.com)                   | 🧠 Prompt Generation | Ultra-fast LLM inference to craft stunning, evocative prompts underneath the hood.                 |

---

## 📱 Permissions

Chroma handles device storage natively:

- **iOS** — Prompts for Photo Library `ADD_ONLY` access.
- **Android** — Requires `WRITE_EXTERNAL_STORAGE` and `READ_MEDIA_IMAGES` up to Android 14 requirements.

---

## 💬 Community & Support

Join the **Lazy Devs** Discord community to chat, get help, or showcase your stunning generations!

<a href="https://discord.com/invite/ZVCB8EnRX2">
  <img src="https://img.shields.io/badge/Discord-Join_Lazy_Devs-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join Lazy Devs Discord" />
</a>

---

<div align="center">
  <p>
    <a href="https://chroma.lazyshrey.in">🌐 chroma.lazyshrey.in</a> •
    <a href="https://discord.com/invite/ZVCB8EnRX2">💬 Discord</a>
  </p>
  <b>Built with ❤️ by Shrey Jaiswal</b>
</div>
