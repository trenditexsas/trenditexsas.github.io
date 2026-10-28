const DISCORD_ID = "TU_ID_DE_DISCORD";
const MOSTRAR_ACTIVIDAD = false;
const NAMESPACE_VISITAS = "trenditexsas-perfil";
const ZONAS = [
  { etiqueta: "MX", zona: "America/Mexico_City" }
];
const TEMAS = ["electrico", "hielo", "marino", "cielo", "indigo", "verde", "ambar", "rosa"];
const ROLES = ["Programming", "Databases", "Web development", "Game cheats"];
const TEXTO_TITULO = "@trenditexsas";

const raiz = document.documentElement;
const esPuntero = window.matchMedia("(pointer: fine)").matches;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const spanRol = document.getElementById("rol");
let rolActual = 0;
let letra = 0;
let borrando = false;

function escribirRol() {
  const palabra = ROLES[rolActual];
  spanRol.textContent = palabra.slice(0, letra);
  let espera = borrando ? 50 : 100;

  if (!borrando && letra === palabra.length) {
    borrando = true;
    espera = 1600;
  } else if (borrando && letra === 0) {
    borrando = false;
    rolActual = (rolActual + 1) % ROLES.length;
    espera = 400;
  } else {
    letra += borrando ? -1 : 1;
  }

  setTimeout(escribirRol, espera);
}
escribirRol();

const lienzo = document.getElementById("particulas");
const pctx = lienzo.getContext("2d");
const raton = { x: -1000, y: -1000 };
let particulas = [];
let colorRGB = "45, 140, 255";

function leerColor() {
  const valor = getComputedStyle(raiz).getPropertyValue("--acento-rgb").trim();
  if (valor) colorRGB = valor;
}

function crearParticulas() {
  lienzo.width = window.innerWidth;
  lienzo.height = window.innerHeight;
  const cantidad = Math.min(110, Math.floor((lienzo.width * lienzo.height) / 16000));
  particulas = Array.from({ length: cantidad }, () => ({
    x: Math.random() * lienzo.width,
    y: Math.random() * lienzo.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  }));
}
crearParticulas();
window.addEventListener("resize", crearParticulas);

function dibujarParticulas() {
  pctx.clearRect(0, 0, lienzo.width, lienzo.height);

  for (let i = 0; i < particulas.length; i++) {
    const p = particulas[i];

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > lienzo.width) p.vx *= -1;
    if (p.y < 0 || p.y > lienzo.height) p.vy *= -1;

    const dx = p.x - raton.x;
    const dy = p.y - raton.y;
    const distRaton = Math.hypot(dx, dy);

    if (distRaton < 130 && distRaton > 0) {
      const fuerza = (130 - distRaton) / 130;
      p.x += (dx / distRaton) * fuerza * 2.2;
      p.y += (dy / distRaton) * fuerza * 2.2;
    }

    pctx.beginPath();
    pctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
    pctx.fillStyle = "rgba(" + colorRGB + ", 0.75)";
    pctx.fill();

    for (let j = i + 1; j < particulas.length; j++) {
      const q = particulas[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        pctx.beginPath();
        pctx.moveTo(p.x, p.y);
        pctx.lineTo(q.x, q.y);
        pctx.strokeStyle = "rgba(" + colorRGB + "," + ((1 - d / 120) * 0.35) + ")";
        pctx.lineWidth = 1;
        pctx.stroke();
      }
    }

    if (distRaton < 170) {
      pctx.beginPath();
      pctx.moveTo(p.x, p.y);
      pctx.lineTo(raton.x, raton.y);
      pctx.strokeStyle = "rgba(" + colorRGB + "," + ((1 - distRaton / 170) * 0.5) + ")";
      pctx.lineWidth = 1;
      pctx.stroke();
    }
  }
}

const botonTema = document.getElementById("tema");
const nombreTema = document.getElementById("nombre-tema");
let indiceTema = Math.max(0, TEMAS.indexOf(raiz.getAttribute("data-tema")));

function aplicarTema(nombre) {
  raiz.setAttribute("data-tema", nombre);
  nombreTema.textContent = nombre;
  try { localStorage.setItem("tema", nombre); } catch (e) {}
  leerColor();
}
aplicarTema(TEMAS[indiceTema]);

botonTema.addEventListener("click", () => {
  indiceTema = (indiceTema + 1) % TEMAS.length;
  aplicarTema(TEMAS[indiceTema]);
});

const rombo = document.querySelector(".rombo");
const hexFlotante = document.getElementById("hex-flotante");
const ventana = document.querySelector(".ventana");

let mouseX = 0, mouseY = 0;
let romboX = 0, romboY = 0;
let inclX = 0, inclY = 0;
let objX = 0, objY = 0;

document.addEventListener("mousemove", (e) => {
  if (!document.body.classList.contains("cursor-propio")) {
    romboX = e.clientX;
    romboY = e.clientY;
    document.body.classList.add("cursor-propio");
  }
  mouseX = e.clientX;
  mouseY = e.clientY;
  raton.x = e.clientX;
  raton.y = e.clientY;
  rombo.classList.add("visible");
  hexFlotante.classList.add("visible");

  const valor = ((mouseX << 12) | mouseY) & 0xFFFFFF;
  hexFlotante.textContent = "0x" + valor.toString(16).toUpperCase().padStart(6, "0");

  objY = (e.clientX / window.innerWidth - 0.5) * 8;
  objX = -(e.clientY / window.innerHeight - 0.5) * 6;
});

raiz.addEventListener("mouseleave", () => {
  raton.x = -1000;
  raton.y = -1000;
  objX = 0;
  objY = 0;
});

function bucle() {
  romboX += (mouseX - romboX) * 0.2;
  romboY += (mouseY - romboY) * 0.2;
  rombo.style.transform = "translate(" + (romboX - 13) + "px, " + (romboY - 13) + "px) rotate(45deg)";
  hexFlotante.style.transform = "translate(" + (romboX + 26) + "px, " + (romboY + 30) + "px)";

  if (esPuntero && !sinMovimiento) {
    inclX += (objX - inclX) * 0.08;
    inclY += (objY - inclY) * 0.08;
    ventana.style.setProperty("--rx", inclX.toFixed(2) + "deg");
    ventana.style.setProperty("--ry", inclY.toFixed(2) + "deg");
  }

  if (!sinMovimiento) dibujarParticulas();
  requestAnimationFrame(bucle);
}
bucle();

document.querySelectorAll("a, button, input").forEach(el => {
  el.addEventListener("mouseenter", () => rombo.classList.add("grande"));
  el.addEventListener("mouseleave", () => rombo.classList.remove("grande"));
});

const musica = document.getElementById("musica");
const reproductor = document.getElementById("reproductor");
const botonPlay = document.getElementById("play");
const barraProgreso = document.getElementById("progreso");
const tiempoActual = document.getElementById("tiempo-actual");
const tiempoTotal = document.getElementById("tiempo-total");
const controlVolumen = document.getElementById("volumen");
const botonMute = document.getElementById("mute");
let arrastrando = false;

musica.volume = 0.5;

function formatoTiempo(segundos) {
  if (!isFinite(segundos)) return "0:00";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return m + ":" + String(s).padStart(2, "0");
}

function actualizarIconoVolumen() {
  if (musica.muted || musica.volume === 0) botonMute.innerHTML = "&#128263;";
  else if (musica.volume < 0.5) botonMute.innerHTML = "&#128265;";
  else botonMute.innerHTML = "&#128266;";
}

botonPlay.addEventListener("click", () => {
  if (musica.paused) musica.play().catch(() => {});
  else musica.pause();
});

musica.addEventListener("play", () => {
  reproductor.classList.add("sonando");
  botonPlay.innerHTML = "&#10074;&#10074;";
});

musica.addEventListener("pause", () => {
  reproductor.classList.remove("sonando");
  botonPlay.innerHTML = "&#9654;";
});

musica.addEventListener("loadedmetadata", () => {
  tiempoTotal.textContent = formatoTiempo(musica.duration);
});

musica.addEventListener("timeupdate", () => {
  if (!arrastrando && musica.duration) {
    barraProgreso.value = (musica.currentTime / musica.duration) * 100;
  }
  tiempoActual.textContent = formatoTiempo(musica.currentTime);
});

barraProgreso.addEventListener("input", () => {
  arrastrando = true;
  tiempoActual.textContent = formatoTiempo((barraProgreso.value / 100) * musica.duration);
});

barraProgreso.addEventListener("change", () => {
  if (musica.duration) musica.currentTime = (barraProgreso.value / 100) * musica.duration;
  arrastrando = false;
});

controlVolumen.addEventListener("input", () => {
  musica.volume = Number(controlVolumen.value);
  musica.muted = musica.volume === 0;
  actualizarIconoVolumen();
});

botonMute.addEventListener("click", () => {
  musica.muted = !musica.muted;
  actualizarIconoVolumen();
});

const tarjetaEstado = document.getElementById("discord-estado");
const textoEstado = document.getElementById("discord-texto");
const detalleEstado = document.getElementById("discord-detalle");
const NOMBRES_ESTADO = {
  online: "En línea",
  idle: "Ausente",
  dnd: "No molestar",
  offline: "Desconectado"
};

async function consultarDiscord() {
  if (!/^\d{15,20}$/.test(DISCORD_ID)) return;

  try {
    const respuesta = await fetch("https://api.lanyard.rest/v1/users/" + DISCORD_ID);
    const json = await respuesta.json();
    if (!json.success) return;

    const estado = json.data.discord_status;
    tarjetaEstado.className = "estado visible " + estado;
    textoEstado.textContent = NOMBRES_ESTADO[estado] || estado;

    let detalle = json.data.discord_user.username;
    if (MOSTRAR_ACTIVIDAD) {
      const actividad = json.data.activities.find(a => a.type !== 4);
      if (actividad) detalle += " · " + actividad.name;
    }
    detalleEstado.textContent = detalle;
  } catch (error) {}
}
consultarDiscord();
setInterval(consultarDiscord, 30000);

const contenedorRelojes = document.getElementById("relojes");

function actualizarRelojes() {
  const ahora = new Date();
  contenedorRelojes.textContent = ZONAS.map(z =>
    z.etiqueta + " " + ahora.toLocaleTimeString("es-MX", { hour12: false, timeZone: z.zona })
  ).join("  |  ");
}
actualizarRelojes();
setInterval(actualizarRelojes, 1000);

const spanVisitas = document.getElementById("visitas");

async function contarVisita() {
  try {
    const contador = new Counter({ version: "v1", namespace: NAMESPACE_VISITAS });
    const res = await contador.up("visitas");
    spanVisitas.textContent = String(res.value).padStart(4, "0");
  } catch (error) {
    const n = Number(localStorage.getItem("visitas") || 0) + 1;
    localStorage.setItem("visitas", n);
    spanVisitas.textContent = String(n).padStart(4, "0");
  }
}
contarVisita();

let pos = 0;
let borrandoTitulo = false;

function animarTitulo() {
  document.title = TEXTO_TITULO.slice(0, pos) + "_";
  let espera = 200;

  if (!borrandoTitulo && pos === TEXTO_TITULO.length) {
    borrandoTitulo = true;
    espera = 1500;
  } else if (borrandoTitulo && pos === 0) {
    borrandoTitulo = false;
    espera = 600;
  } else {
    pos += borrandoTitulo ? -1 : 1;
  }

  setTimeout(animarTitulo, espera);
}
animarTitulo();
