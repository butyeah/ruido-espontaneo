(function () {
  const output = document.getElementById("output");
  const input = document.getElementById("cmd-input");

  const history = [];
  let historyIndex = -1;

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
    printBlank();
    ASCII_TITLE.forEach((l) => print(l, "bright"));
    printBlank();
    print(SITE.tagline, "dim");
    printBlank();
    renderMenu();
  }

  function renderSection(id) {
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

  function renderRedes() {
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
    print("  2 | sesiones      → ver sección Sesiones");
    print("  3 | colectivo     → ver sección Colectivo");
    print("  4 | redes         → ver enlaces a redes sociales");
    print("  0 | inicio | menu → volver al menú principal");
    print("  ayuda | help      → mostrar esta ayuda");
    print("  limpiar | clear   → limpiar la pantalla");
    printBlank();
  }

  function clearScreen() {
    output.innerHTML = "";
  }

  function handleCommand(raw) {
    const cmd = raw.trim().toLowerCase();

    // echo the typed command
    print(`ruido@espontaneo:~$ ${raw}`, "prompt-echo");

    if (cmd === "") return;

    switch (cmd) {
      case "0":
      case "inicio":
      case "menu":
      case "menú":
        renderHome();
        break;
      case "1":
      case "informacion":
      case "información":
        renderSection("informacion");
        break;
      case "2":
      case "sesiones":
        renderSection("sesiones");
        break;
      case "3":
      case "colectivo":
        renderSection("colectivo");
        break;
      case "4":
      case "redes":
      case "social":
      case "sociales":
        renderRedes();
        break;
      case "ayuda":
      case "help":
      case "?":
        renderHelp();
        break;
      case "limpiar":
      case "clear":
      case "cls":
        clearScreen();
        break;
      default:
        print(`Comando no reconocido: "${raw}". Escribe 'ayuda' para ver opciones.`, "error");
    }

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
