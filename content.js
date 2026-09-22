// La lista de sesiones (videos de YouTube) se lee de sessions.json en este
// mismo repositorio. Ese archivo lo genera un GitHub Action que corre en el
// servidor de GitHub usando una API key guardada como "secret" (nunca
// visible aquí ni en el navegador). Ver .github/workflows/update-sessions.yml
const SESSIONS_URL = "sessions.json";

// Contenido editable del sitio. Cambia estos textos y enlaces cuando quieras.
const SITE = {
  nombre: "RUIDO ESPONTANEO",
  tagline: "Foro de sonido, sesiones en vivo y colectivo cultural.",
  redes: [
    { nombre: "Instagram", url: "https://instagram.com/" },
    { nombre: "YouTube", url: "https://youtube.com/" },
  ],
};

// Cada sección tiene: título, y líneas de texto (array de strings).
const SECTIONS = {
  informacion: {
    titulo: "INFORMACIÓN",
    lineas: [
      "Ruido Espontaneo es un foro y colectivo dedicado a la",
      "difusión de música y sonido experimental, sesiones en vivo,",
      "podcasts y entrevistas.",
      "",
      "Organizamos encuentros, DJ sets, foros de discusión y",
      "colaboraciones con artistas locales.",
      "",
      "[ Edita este texto en content.js -> SECTIONS.informacion ]",
    ],
  },
  colectivo: {
    titulo: "COLECTIVO",
    lineas: [
      "Somos un colectivo de artistas, músicos y colaboradores",
      "unidos por el gusto de experimentar con el sonido.",
      "",
      "Colaboradores:",
      "  - @cfcea",
      "  - @luu.feliz",
      "  - @buenveneno",
      "  - @xvolcax",
      "  - @anaflauer",
      "  - rem",
    ],
  },
};
