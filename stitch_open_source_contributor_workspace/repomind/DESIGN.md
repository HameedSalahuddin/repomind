---
name: RepoMind
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c6c5d5'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#908f9e'
  outline-variant: '#454653'
  surface-tint: '#bdc2ff'
  primary: '#bdc2ff'
  on-primary: '#131e8c'
  primary-container: '#818cf8'
  on-primary-container: '#101b8a'
  inverse-primary: '#4953bc'
  secondary: '#ddb8ff'
  on-secondary: '#490081'
  secondary-container: '#62259b'
  on-secondary-container: '#d1a1ff'
  tertiary: '#4de082'
  on-tertiary: '#003919'
  tertiary-container: '#00ac58'
  on-tertiary-container: '#003617'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#2f3aa3'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#62259b'
  tertiary-fixed: '#6dfe9c'
  tertiary-fixed-dim: '#4de082'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
  display-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  sidebar: 240px
  sidebar-collapsed: 56px
  inspector: 340px
  gutter: 1px
---

## Brand & Style

The design system embodies a **Beautiful Developer Tool** aesthetic—a high-performance, obsidian-dark environment designed for deep cognitive flow and technical precision. It moves away from "gamer" neon or cyberpunk clutter, opting instead for a sophisticated, "Pro" workspace feel that balances the authoritative nature of an IDE with the approachable guidance of an AI mentor.

The visual language is characterized by:
- **Obsidians & Ink:** A foundation of near-black surfaces that prioritize content and code legibility.
- **Precision Minimalism:** Heavy use of hairline borders, generous but functional whitespace, and a strict 4px grid.
- **Functional Glow:** Color is used sparingly as a data-carrier. Subtle glows and translucent fills indicate AI presence, architectural relationships, or contribution difficulty without distracting from the task.
- **Restrained Glassmorphism:** Semi-transparent dark overlays with soft backdrop blurs create a sense of depth and focus, particularly for floating command palettes and inspector panels.

## Colors

The palette is rooted in an **Obsidian Base** to minimize eye strain during long contribution sessions. 

- **Primary (Architecture Indigo):** Used for structural navigation, primary actions, and dependency mapping.
- **Secondary (Investigation Purple):** Reserved for AI-driven insights, hypothesis tracking, and the "AI Mentor" personality.
- **Tertiary (Discovery Green):** Indicates "Good First Issues," success states, and beginner-friendly entry points.
- **Surface Strategy:** Layers are built using incremental hex shifts rather than heavy shadows. `Background` is the deepest layer, `Surface` (Card) is the mid-layer, and `Elevated` (Popovers) uses a semi-transparent glass effect.
- **Accents:** Use `Cyan (#38BDF8)` for Git history and timelines, and `Amber (#FBBF24)` for warnings or moderate complexity tasks.

## Typography

This design system uses a dual-font strategy to separate UI controls from technical content.

- **UI & Prose:** Geist/Inter provides a neutral, modern grotesque feel for navigation and documentation. Geist is preferred for headlines to maintain a technical "sharpness."
- **Code & Logic:** JetBrains Mono is used for all code snippets, file paths, terminal outputs, and metadata labels (e.g., commit SHAs).
- **Hierarchy:** Use `label-caps` in uppercase for section headers in sidebars and micro-labels on graph nodes to evoke a "blueprint" feel.
- **Scaling:** On mobile, `display-xl` should scale down to `24px` to avoid awkward wrapping in dense documentation views.

## Layout & Spacing

The layout utilizes a **Multi-Pane Workbench** model, mirroring professional IDEs. 

- **Grid Model:** A 12-column fluid grid is used within the "Main Stage" area, but the overall shell is governed by fixed-width sidebars and flexible central panels.
- **The Hairline Gutter:** Instead of traditional 16px gutters between panels, this system uses 1px "hairline" borders (`#1F1F23`) to separate tool windows, maximizing screen real estate for code.
- **Breakpoints:** 
  - **Desktop (>1440px):** 3-pane view (File Tree + Editor + AI Inspector).
  - **Tablet (1024px):** Inspector collapses into a right-aligned drawer; File Tree becomes a hover-panel.
  - **Mobile:** Single-pane view with a bottom-docked navigation bar for the 7 key pillars.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Restrained Glassmorphism** rather than traditional drop shadows.

- **Level 0 (Canvas):** `#0D0D0F`. The base for the entire application.
- **Level 1 (Panels):** `#18181D`. Standard cards and sidebars. 1px border (`#1F1F23`).
- **Level 2 (Active/Elevated):** Glass panels (`rgba(24, 24, 29, 0.75)`) with a `12px` backdrop blur and a subtle white-translucent border (`rgba(255,255,255,0.08)`). This is used for modals and the Command Palette.
- **Shadows:** Only used on elevated glass panels to provide a subtle "lift" from the dark background. Use a highly diffused black shadow: `0 8px 32px rgba(0, 0, 0, 0.45)`.

## Shapes

The shape language is **Soft (0.25rem)**. 

Developer tools require high information density; therefore, sharp or slightly softened corners are preferred over large rounded radii to maintain a grid-aligned, professional appearance.
- **Small Elements (Tabs, Buttons, Chips):** 4px (`rounded-xs`).
- **Standard Containers (Cards, Modals):** 8px (`rounded-default`).
- **Nodes in Architecture Maps:** 12px (`rounded-lg`) to differentiate "objects" from "containers."
- **Pill Shapes:** Reserved exclusively for status indicators (e.g., "Online") and difficulty badges.

## Components

### Buttons
- **Primary:** Indigo background (`#818CF8`), black text. Subtle glow on hover.
- **AI Action:** Subtle purple gradient fill with a crisp `#C084FC` border. Features a "sparkle" icon.
- **Ghost:** Transparent background, `Text Secondary` color. Shifts to `Text Primary` on hover with a `Surface High` background.

### Cards & Panels
- **Standard:** Solid `#18181D` fill with 1px border. 
- **Active Node:** Architecture nodes use a color-coded border (Purple for Core, Blue for Middleware) and an animated pulse if they are part of the active execution path.

### Inputs & Toggles
- **Fields:** Near-black background, 1px border. Focus state uses an Indigo border and a 2px outer glow.
- **Checkboxes:** Square with 2px radius. Success-green fill when checked.

### Lists & Trees
- **File Tree:** 24px height per row. Mono-font. Use subtle "guide lines" to show folder nesting levels.
- **Issue List:** Multi-line items with difficulty chips on the right and "AI Match Score" displayed as a small circular progress ring.

### Navigation Pillars
A vertical icon-only rail on the far left. Active state is indicated by a vertical 3px "glow bar" in the corresponding pillar's accent color (e.g., Green for Start Contributing, Purple for Investigations).