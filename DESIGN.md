---
name: CommandDeck
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#4cd6ff'
  primary: '#a4e6ff'
  on-primary: '#003543'
  primary-container: '#00d1ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#4ae183'
  on-secondary: '#003919'
  secondary-container: '#06bb63'
  on-secondary-container: '#00431f'
  tertiary: '#ffd95f'
  on-tertiary: '#3c2f00'
  tertiary-container: '#e7bc00'
  on-tertiary-container: '#604c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b7eaff'
  primary-fixed-dim: '#4cd6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  container-max: 1440px
  sidebar-width: 280px
  gutter: 16px
  margin-edge: 24px
---

## Brand & Style

The brand identity is built on technical authority, precision, and the focused intensity of a cybersecurity operations center. This design system prioritizes high-density information architecture and immediate legibility, moving away from consumer-grade softness toward a professional, utility-first aesthetic.

The design style is **High-Contrast Digital Minimalism** with a **Technological Edge**. It utilizes a "Terminal-Plus" approach: the raw efficiency of a command-line interface refined by modern UI affordances. Visual cues are used strictly for functional hierarchy—light is used to indicate focus, color to indicate action, and sharp geometry to reinforce the "hardened" nature of the security sector. The emotional response should be one of calm control in high-pressure environments.

## Colors

The palette is anchored in a "Deep Space" hierarchy to minimize eye strain during long-form technical sessions.

- **Primary (Electric Cyan):** Reserved for primary actions, focus states, and active navigation indicators. It represents connectivity and active scanning.
- **Secondary (Terminal Green):** Used for success states, "safe" command parameters, and system-ready indicators.
- **Accent (Alert Amber):** Used sparingly for warnings or high-risk command flags.
- **Neutrals:** The background (#0A0C10) provides the base layer, while the surface (#111827) creates subtle depth for cards and sidebars. 
- **Borders:** A consistent, low-contrast gray (#1F2937) defines the structure without creating visual noise.

## Typography

This design system uses a dual-type approach to distinguish between the "Interface" and the "Data."

**Inter** handles all UI navigation, labels, and instructional text. It is chosen for its exceptional legibility at small sizes and its neutral, professional tone.

**JetBrains Mono** is the workhorse for all command syntax, code snippets, and technical parameters. It provides the necessary character distinction (e.g., 0 vs O) required for error-free command execution. 

Use `label-caps` for metadata, category headers in sidebars, and keyboard shortcut hints. Mobile scaling reduces `headline-lg` to 24px to maintain layout integrity.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid Grid**. Sidebars and utility panels occupy fixed widths to ensure consistent tool access, while the main content area (the command console) remains fluid to maximize code visibility.

- **Grid:** A 12-column layout on desktop, transitioning to a single-column stack on mobile.
- **Rhythm:** An 8px/4px base grid ensures tight, technical spacing. Compactness is preferred over "airy" whitespace to keep information above the fold.
- **Breakpoints:**
  - Mobile: < 768px (Sidebar hidden, accessible via drawer)
  - Tablet: 768px - 1024px (Sidebar collapsed to icons)
  - Desktop: > 1024px (Full persistent sidebar)

## Elevation & Depth

In keeping with the technical, "flat" aesthetic, this design system avoids soft ambient shadows. Instead, depth is conveyed through **Tonal Layering** and **High-Contrast Outlines**.

- **Level 0 (Background):** #0A0C10 - The deepest layer, used for the main application backdrop.
- **Level 1 (Surface):** #111827 - Used for sidebars, cards, and navigation bars.
- **Level 2 (Active/Popup):** #1F2937 - Used for dropdowns and tooltips, defined by a 1px solid border in the Primary color (#00D1FF) to indicate focus.
- **Focus States:** Rather than shadows, focused elements use a "Glow Border"—a 1px solid Primary color stroke with a subtle 4px outer glow of the same color at 30% opacity.

## Shapes

The shape language is strictly **Geometric and Sharp**. 

- **Corners:** 0px radius for all primary containers, buttons, and input fields. This reinforces the precision and "hardened" feel of the tool.
- **Indicators:** Use 45-degree chamfers on active tab states or "dog-ear" folds on card corners to add technical character without introducing roundness.
- **Icons:** Use thin-stroke, square-ended icons that align with the JetBrains Mono font weight.

## Components

- **Buttons:** Primary buttons use a solid #00D1FF background with black text. Secondary buttons are transparent with a 1px #1F2937 border. Hover states trigger a subtle Primary color flicker or background shift.
- **Code Blocks:** Encased in a #111827 container with a subtle 1px border. Features a sticky header with the language type (in `label-caps`) and a "Copy" icon that flashes green (#2ECC71) upon successful action.
- **Sidebars:** Active items are indicated by a 2px vertical "power-line" on the left edge in Cyan and a subtle background shift.
- **Search Bars:** Command-line style. Focused search bars should lose their border and gain a Primary color underline, accompanied by a blinking block cursor.
- **Chips/Tags:** Sharp-edged boxes with `label-caps` text. High-risk tags use a #FACC15 outline; "Safe" tags use a #2ECC71 outline.
- **Input Fields:** Dark background, sharp corners, and monospace text entry. Errors are shown via a 1px red border—avoiding soft "glows" in favor of crisp lines.