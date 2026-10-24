# 🥤 Coca-Cola 3D Web Experience

An immersive, modern, interactive 3D web experience celebrating the iconic **Coca-Cola — The Original. Always.** Built with clean Vanilla HTML5, CSS3, JavaScript, and Three.js WebGL rendering.

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![GitHub Pages Ready](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen.svg)](#-deploy-to-github-pages)

---

## ✨ Features

- **🥫 Interactive 3D Can (Three.js WebGL)**:
  - Procedural 3D can lathe geometry with aluminum top rim, pull tab, rivet, and score line.
  - Realistic studio reflection environment map and physically based clearcoat materials.
  - Dynamic 2D canvas texture generation for authentic Coca-Cola contour ribbon and typography.
  - **3 Flavor Variations**: Original Taste, Zero Sugar, and Cherry with instant real-time texture and ambient color transitions.
  - **Inertial Pointer Drag Controls**: Drag to rotate 360°, touch gestures for mobile, pause/resume rotation, and reset view.
  - **Scroll Parallax Effect**: Smooth scroll-linked tilt and rotation as you explore the page.

- **🌓 Dark & Light Mode**:
  - One-click toggle with smooth theme transition.
  - Persisted in browser `localStorage` and respects system `prefers-color-scheme`.

- **🎨 Dynamic Flavor Profile Showcase**:
  - Interactive taste profile meters (Fizz, Sweetness, Boldness) with animated gauge transitions.
  - Preview can color and label synchronization.

- **🏪 Brand Family Showcase**:
  - Showcases Coca-Cola, Sprite, Thums Up, Limca, Fanta, and Maaza with hover lift and lighting effects.

- **⚡ Modern Responsive Design & Typography**:
  - Fluid clamp typography with *Barlow Condensed*, *Manrope*, and *Yellowtail*.
  - Infinite smooth marquee ticker animation.
  - IntersectionObserver scroll reveal micro-animations.
  - Responsive across smartphones, tablets, and ultra-wide desktops.

- **📩 Newsletter Interaction**:
  - Form validation with inline feedback status message.

---

## 📁 Project Structure

```text
Cococola/
├── index.html        # Main semantic HTML5 structure & SEO tags
├── css/
│   └── style.css     # Design tokens, themes, layout & animations
├── js/
│   ├── can-3d.js     # Three.js 3D can canvas, lighting & interaction
│   └── main.js       # Flavor picker, theme toggle, form & scroll observer
├── assets/           # Media & static assets
├── .gitignore        # Git ignore rules
└── README.md         # Documentation & guide
```

---

## 🚀 Running Locally

No complex build steps or dependencies required! You can run it with any static server:

### Option 1: VS Code Live Server
1. Open the project in VS Code.
2. Click **Go Live** on `index.html` (or right-click `index.html` → *Open with Live Server*).

### Option 2: Python HTTP Server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Option 3: Node.js (npx serve)
```bash
npx serve .
```

---

## 🌐 Deploy to GitHub & GitHub Pages

This repository is ready to be pushed to GitHub:

### 1. Initialize & Push to your GitHub Repository
```bash
# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages (Free Hosting)
1. Go to your repository on **GitHub**.
2. Click **Settings** → **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then click **Save**.
5. Within 1–2 minutes, your website will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## 🛠️ Built With

- **HTML5** — Semantic, accessible markup.
- **Vanilla CSS3** — CSS custom properties, grid/flexbox, glassmorphism, responsive clamps.
- **Vanilla JavaScript (ES6+)** — Modular DOM & state management.
- **Three.js (r128)** — 3D scene rendering, PBR materials, and camera math.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
*Note: Brand marks, product names, and trade dress belong to their respective trademark holders.*
