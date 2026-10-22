// Config Tailwind identica a quella che queste pagine passavano al CDN (tailwind.config = ...).
// Pagine che usano /assets/css/tw-base.css:
//   chi-sono/index.html
//   cookie/index.html
//   il-critico-instancabile/index.html
//   il-guardiano-del-consenso/index.html
//   il-perfezionista-bloccato/index.html
//   index.html
//   l-esploratore-esitante/index.html
//   metodo/index.html
//   privacy/index.html
//   reset-notturno/index.html
const config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "background": "#101416",
          "on-background": "#F5F7FA",
          "surface": "#101416",
          "on-surface": "#F5F7FA",
          "primary": "#49C7A5",
          "on-primary": "#101416",
          "primary-container": "#49C7A5",
          "on-primary-container": "#101416",
          "primary-fixed-dim": "#60dbb8",
          "secondary": "#3A63FF",
          "on-secondary": "#FFFFFF",
          "on-secondary-container": "#c1cbff",
          "secondary-container": "#0543e3",
          "tertiary": "#C9A45C",
          "on-tertiary": "#101416",
          "on-tertiary-container": "#5b4100",
          "outline": "#86948e",
          "outline-variant": "#3d4944",
          "surface-container": "#1d2022",
          "surface-container-low": "#191c1e",
          "surface-container-high": "#272a2d",
          "surface-container-highest": "#323538",
          "surface-container-lowest": "#0b0f11",
          "surface-dim": "#101416",
          "surface-variant": "#323538",
          "on-surface-variant": "#bccac3"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"
        },
        "spacing": {
          "section-v-desktop": "104px", "stack-sm": "8px", "container-max": "1280px",
          "stack-lg": "32px", "stack-md": "16px", "section-v-mobile": "64px", "gutter": "24px"
        },
        "fontFamily": {
          "label-md": ["Inter"], "body-md": ["Inter"], "headline-lg": ["Manrope"],
          "headline-md": ["Manrope"], "body-lg": ["Inter"], "display-lg": ["Manrope"],
          "display-lg-mobile": ["Manrope"]
        },
        "fontSize": {
          "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600"}],
          "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
          "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "600"}],
          "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "600"}],
          "body-lg": ["20px", {"lineHeight": "1.6", "fontWeight": "400"}],
          "display-lg": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
          "display-lg-mobile": ["40px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700"}]
        }
      }
    }
  };

config.content = { relative: true, files: [
    "../chi-sono/index.html",
    "../cookie/index.html",
    "../il-critico-instancabile/index.html",
    "../il-guardiano-del-consenso/index.html",
    "../il-perfezionista-bloccato/index.html",
    "../index.html",
    "../l-esploratore-esitante/index.html",
    "../metodo/index.html",
    "../privacy/index.html",
    "../reset-notturno/index.html",
    "../assets/*.js"
  ] };
config.plugins = [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')];

module.exports = config;
