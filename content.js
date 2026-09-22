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
  sesiones: {
    titulo: "SESIONES",
    lineas: [
      "Próximas sesiones y grabaciones en vivo:",
      "",
      "  - Sesión en vivo desde Foro Ruido",
      "  - DJ sets y colaboraciones",
      "  - Podcasts y episodios grabados",
      "",
      "[ Edita este texto en content.js -> SECTIONS.sesiones ]",
    ],
  },
  colectivo: {
    titulo: "COLECTIVO",
    lineas: [
      "Somos un colectivo de artistas, músicos y colaboradores",
      "unidos por el gusto de experimentar con el sonido.",
      "",
      "  - Artistas invitados",
      "  - Colaboradores del foro",
      "  - Alianzas con otros espacios culturales",
      "",
      "[ Edita este texto en content.js -> SECTIONS.colectivo ]",
    ],
  },
};
