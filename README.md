# 💄 MVP Kosmetic — High-End Makeup Course Landing Page

<div align="center">

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/gsap-%2388CE02.svg?style=for-the-badge&logo=greensock&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)

</div>

Premium landing page for Olga Pavilina's makeup course. This project merges high-end aesthetics with complex kinetic typography and industry-standard performance optimizations.

---

## 🌟 Key Features

- **Cinematic Experience**: Immersive entry animations and scroll-triggered effects powered by GSAP.
- **Magnetic UX**: A reusable custom hook for magnetic interaction on CTA elements.
- **Advanced Scroll**: Integration of Lenis for smooth, momentum-based navigation.
- **Feature-Sliced Design (FSD)**: Scalable and maintainable architecture following the FSD methodology.
- **Performance Optimized**: Optimized asset loading (LCP/CLS), modern image formats, and lazy loading strategies.
- **Mobile-First**: Pixel-perfect responsiveness across all device categories.

## 🛠 Tech Stack

| Category       | Technology                                                                                     |
| :------------- | :--------------------------------------------------------------------------------------------- |
| **Framework**  | ![Vue.js](https://img.shields.io/badge/Vue_3-35495E?style=flat&logo=vuedotjs&logoColor=4FC08D) |
| **Animation**  | ![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=flat&logo=greensock&logoColor=white)  |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)         |
| **Runtime**    | ![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)            |
| **Styling**    | ![SASS](https://img.shields.io/badge/SCSS-CF649A?style=flat&logo=sass&logoColor=white)         |

## 🏗 Architecture

The project implements **Feature-Sliced Design (FSD)** to ensure clear separation of concerns:

```text
src/
├── app/              # App initialization & global providers
├── pages/            # Page-level compositions
├── widgets/          # Complex cross-functional components (Header, Footer)
├── features/         # Business-logic modules (hero-anim, booking-logic)
├── entities/         # Domain-specific components (AudienceCard, Review)
└── shared/           # Reusable UI, Composables (useMagnetic), Assets
```

## 📽 Animations & UX Patterns

- **Kinetic Typography**: Character-by-character text reveals with elastic easing.
- **useMagnetic Composable**: A custom Vue 3 hook that adds magnetic pull to buttons, enhancing interactivity.
- **Parallax Decor**: Layered backgrounds and decorative elements that react to scroll velocity.
- **Custom Preloader**: Unified loading experience with smooth transition to content.

## ⚙️ Getting Started

### Prerequisites

Optimized for **Bun**. Install via: `curl -fsSL https://bun.sh/install | bash`

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Access at: `http://localhost:5173`

### Production Build

```bash
bun run build
# Preview build:
bun run preview
```

## 🎨 Design System

- **Typography**:
  - `Montserrat`: Primary body & UI
  - `Playfair Display`: High-contrast headings
  - `Great Vibes`: Accents and signature
- **Color Palette**:
  - `Primary`: #A81C26 (Imperial Red)
  - `Secondary`: #1B3F2B (Deep Emerald)
  - `Dark`: #1A0406 (Rich Black)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Developed with ❤️ for the Olga Pavilina Makeup Team
</div>
