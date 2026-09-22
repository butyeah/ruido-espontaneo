(function () {
  const output = document.getElementById("output");
  const input = document.getElementById("cmd-input");
  const player = document.getElementById("player");

  const history = [];
  let historyIndex = -1;

  // mode: "menu" | "sesiones-list" | "sesiones-player"
  let mode = "menu";
  let sessionsCache = null; // array of { title, videoId }

  function clearPlayer() {
    player.innerHTML = "";
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function print(line = "", cls = "") {
    const span = document.createElement("span");
    if (cls) span.className = cls;
    span.innerHTML = escapeHtml(line);
    output.appendChild(span);
    output.appendChild(document.createTextNode("\n"));
  }

  function printLines(lines, cls = "") {
    lines.forEach((l) => print(l, cls));
  }

  function printBlank() {
    output.appendChild(document.createTextNode("\n"));
  }

  // Para líneas con HTML de confianza (enlaces), generado solo a partir de
  // content.js, nunca de datos externos o del usuario.
  function printHtml(html, cls = "") {
    const span = document.createElement("span");
    if (cls) span.className = cls;
    span.innerHTML = html;
    output.appendChild(span);
    output.appendChild(document.createTextNode("\n"));
  }

  const ASCII_TITLE = [
    "┌──────────────────────────────────┐",
    "│        R U I D O                  │",
    "│        E S P O N T A N E O        │",
    "└──────────────────────────────────┘",
  ];

  const MENU_ITEMS = [
    { key: "1", id: "informacion", label: "Información" },
    { key: "2", id: "sesiones", label: "Sesiones" },
    { key: "3", id: "colectivo", label: "Colectivo" },
  ];

  function renderMenu() {
    print("MENÚ PRINCIPAL", "bright");
    print("──────────────", "dim");
    MENU_ITEMS.forEach((item) => {
      print(`  [${item.key}] ${item.label}`);
    });
    print("  [4] Redes sociales");
    print("  [0] Inicio");
    printBlank();
    print("Escribe un número y presiona Enter. Escribe 'ayuda' para ver todos los comandos.", "dim");
    printBlank();
  }

  function renderHome() {
    mode = "menu";
    clearPlayer();
    printBlank();
    ASCII_TITLE.forEach((l) => print(l, "bright"));
    printBlank();
    print(SITE.tagline, "dim");
    printBlank();
    renderMenu();
  }

  function renderSection(id) {
    mode = "menu";
    clearPlayer();
    const section = SECTIONS[id];
    if (!section) {
      print(`Sección no encontrada: ${id}`, "error");
      return;
    }
    printBlank();
    print(section.titulo, "amber");
    print("─".repeat(section.titulo.length), "dim");
    printLines(section.lineas);
    printBlank();
    print("[0] Volver al menú   [4] Redes sociales", "dim");
    printBlank();
  }

  function renderColectivo() {
    mode = "menu";
    clearPlayer();
    const section = SECTIONS.colectivo;
    printBlank();
    print(section.titulo, "amber");
    print("─".repeat(section.titulo.length), "dim");
    printLines(section.intro);
    printBlank();
    print("Colaboradores:");
    section.colaboradores.forEach((c) => {
      if (c.instagram) {
        printHtml(
          `  - ${escapeHtml(c.handle)} — <a class="link" href="${c.instagram}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.instagram)}</a>`
        );
      } else {
        print(`  - ${c.handle}`);
      }
    });
    printBlank();
    print("[0] Volver al menú   [4] Redes sociales", "dim");
    printBlank();
  }

  function renderRedes() {
    mode = "menu";
    clearPlayer();
    printBlank();
    print("REDES SOCIALES", "amber");
    print("──────────────", "dim");
    SITE.redes.forEach((r) => print(`  ${r.nombre}: ${r.url}`));
    printBlank();
    print("[0] Volver al menú", "dim");
    printBlank();
  }

  function renderHelp() {
    printBlank();
    print("COMANDOS DISPONIBLES", "amber");
    print("─────────────────────", "dim");
    print("  1 | informacion   → ver sección Información");
    print("  2 | sesiones      → ver lista de sesiones (YouTube)");
    print("  3 | colectivo     → ver sección Colectivo");
    print("  4 | redes         → ver enlaces a redes sociales");
    print("  0 | inicio | menu → volver al menú principal");
    print("  ayuda | help      → mostrar esta ayuda");
    print("  limpiar | clear   → limpiar la pantalla");
    printBlank();
    print("Dentro de Sesiones: escribe el número del video para reproducirlo.", "dim");
    printBlank();
  }

  function clearScreen() {
    output.innerHTML = "";
  }

  // ---- Sesiones (YouTube) ----

  async function fetchSessions() {
    const res = await fetch(`${SESSIONS_URL}?t=${Date.now()}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  async function renderSesionesList(useCache = false) {
    mode = "sesiones-list";
    clearPlayer();
    printBlank();
    print("SESIONES", "amber");
    print("────────", "dim");

    if (useCache && sessionsCache) {
      printSessionsList();
      return;
    }

    print("Cargando videos desde YouTube...", "dim");

    try {
      sessionsCache = await fetchSessions();
      // Remove the "Cargando..." line and reprint cleanly.
      print("");
      printSessionsList();
    } catch (err) {
      print(`No se pudo cargar la lista de YouTube (${err.message}).`, "error");
      print("Intenta de nuevo más tarde, o visita el canal directamente:", "dim");
      const yt = SITE.redes.find((r) => r.nombre === "YouTube");
      if (yt) print(`  ${yt.url}`);
      printBlank();
      print("[0] Volver al menú", "dim");
      printBlank();
    }
  }

  function printSessionsList() {
    if (!sessionsCache || sessionsCache.length === 0) {
      print("No hay videos disponibles por ahora.", "dim");
    } else {
      sessionsCache.forEach((s, i) => {
        print(`  [${i + 1}] ${s.title}`);
      });
    }
    printBlank();
    print("Escribe el número de una sesión para reproducirla.", "dim");
    print("[0] Volver al menú   [4] Redes sociales", "dim");
    printBlank();
  }

  function playSession(index) {
    const session = sessionsCache[index];
    if (!session) {
      print("Sesión no encontrada.", "error");
      return;
    }
    mode = "sesiones-player";
    printBlank();
    print(`▶ ${session.title}`, "amber");
    printBlank();
    player.innerHTML = `<iframe src="https://www.youtube.com/embed/${session.videoId}?autoplay=1"
      title="${session.title.replace(/"/g, "&quot;")}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
    printBlank();
    print("[0] Volver a la lista de sesiones", "dim");
    printBlank();
  }

  function handleCommand(raw) {
    const cmd = raw.trim().toLowerCase();

    // echo the typed command
    print(`ruido@espontaneo:~$ ${raw}`, "prompt-echo");

    if (cmd === "") return;

    // Global keywords work from any mode.
    if (cmd === "inicio" || cmd === "menu" || cmd === "menú") {
      renderHome();
      scrollDown();
      return;
    }
    if (cmd === "ayuda" || cmd === "help" || cmd === "?") {
      renderHelp();
      scrollDown();
      return;
    }
    if (cmd === "limpiar" || cmd === "clear" || cmd === "cls") {
      clearScreen();
      return;
    }

    // Context-aware numeric input inside Sesiones.
    if (mode === "sesiones-list") {
      if (cmd === "0") {
        renderHome();
        scrollDown();
        return;
      }
      const idx = parseInt(cmd, 10);
      if (!isNaN(idx) && sessionsCache && idx >= 1 && idx <= sessionsCache.length) {
        playSession(idx - 1);
        scrollDown();
        return;
      }
    } else if (mode === "sesiones-player") {
      if (cmd === "0") {
        renderSesionesList(true);
        scrollDown();
        return;
      }
    }

    switch (cmd) {
      case "0":
        renderHome();
        break;
      case "1":
      case "informacion":
      case "información":
        renderSection("informacion");
        break;
      case "2":
      case "sesiones":
        renderSesionesList();
        break;
      case "3":
      case "colectivo":
        renderColectivo();
        break;
      case "4":
      case "redes":
      case "social":
      case "sociales":
        renderRedes();
        break;
      default:
        print(`Comando no reconocido: "${raw}". Escribe 'ayuda' para ver opciones.`, "error");
    }

    scrollDown();
  }

  function scrollDown() {
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = input.value;
      history.push(value);
      historyIndex = history.length;
      input.value = "";
      handleCommand(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex] || "";
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    }
  });

  document.getElementById("terminal").addEventListener("click", () => input.focus());
  window.addEventListener("load", () => input.focus());

  // Boot
  renderHome();
})();
