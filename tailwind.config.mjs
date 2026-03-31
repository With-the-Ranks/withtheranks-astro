/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"League Gothic"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Tofino Personal"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)", card: "2rem" },
      outlineOffset: { inward: "-2px" },
      colors: {
        background: "var(--main-bg-color)", foreground: "var(--main-text-color)", "accent-green": "var(--stop-one-color)", "accent-purple": "var(--stop-two-color)",
        "brand-blue": "#0a13b1", "brand-blue-deep": "#0a12a9", "brand-blue-tag": "#0c15b1", "brand-cream": "#fffcf7", "brand-navy": "#0b124c", "cta-start": "#ffefc0", "cta-end": "#fac328",
      },
      maxWidth: {
        "home-shell": "1488px", "hero-pill": "1040px", "hero-copy": "1120px", "hero-body": "760px", "mailer-copy": "520px", "tools-intro": "520px", "tools-body": "498px",
        "work-copy": "840px", "work-card-title": "460px", "about-copy": "528px", "contact-copy": "920px", "contact-body": "654px", "footer-wordmark": "964px",
      },
      gridTemplateColumns: { "home-mailer": "492px minmax(0, 1fr)", "home-tools": "minmax(0, 1fr) 528px" },
      minHeight: { "home-about-media": "360px", "home-about": "680px" },
      height: { "scroll-cue": "5.125rem", "mailer-panel": "517px", "work-card": "404px" },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "body-lg": ["1.5rem", { lineHeight: "1.4" }], body: ["1rem", { lineHeight: "1.5" }],
        "home-hero": ["clamp(4.5rem, 12vw, 10rem)", { lineHeight: "0.92" }], "home-hero-body": ["clamp(1.15rem, 2vw, 1.75rem)", { lineHeight: "1.3" }],
        "home-mailer": ["clamp(3.1rem, 5vw, 3.875rem)", { lineHeight: "0.95" }], "home-tools": ["clamp(4.25rem, 7vw, 7rem)", { lineHeight: "0.92" }],
        "home-section": ["clamp(4rem, 7vw, 7rem)", { lineHeight: "0.94" }], "home-section-body": ["clamp(1.1rem, 1.8vw, 1.375rem)", { lineHeight: "1.35" }],
        "home-work-title": ["clamp(1.8rem, 3vw, 2.25rem)", { lineHeight: "1.06" }], "home-tool-title": ["52px", { lineHeight: "0.92" }],
        "home-contact-title": ["40px", { lineHeight: "1" }], "home-footer": ["60px", { lineHeight: "1" }],
        "home-cta-sm": ["15px", { lineHeight: "1" }], "home-cta-sm-lg": ["17px", { lineHeight: "1.25" }], "home-cta": ["20px", { lineHeight: "1" }],
        "home-cta-body": ["20px", { lineHeight: "1.35" }], "home-tool-lead": ["24px", { lineHeight: "1.12" }], "home-tool-body": ["16px", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
