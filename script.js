const roles = ["Programming", "Databases", "Web development", "Game cheats"];
const spanRol = document.getElementById("rol");
let rolActual = 0;
let letra = 0;
let borrando = false;

function escribirRol() {
  const palabra = roles[rolActual];
  spanRol.textContent = palabra.slice(0, letra);
  let espera = borrando ? 50 : 100;

  if (!borrando && letra === palabra.length) {
    borrando = true;
    espera = 1600;
  } else if (borrando && letra === 0) {
    borrando = false;
    rolActual = (rolActual + 1) % roles.length;
    espera = 400;
  } else {
    letra += borrando ? -1 : 1;
  }

  setTimeout(escribirRol, espera);
}
escribirRol();

const rombo = document.querySelector(".rombo");
const hexFlotante = document.getElementById("hex-flotante");
let mouseX = 0, mouseY = 0;
let romboX = 0, romboY = 0;

document.addEventListener("mousemove", (e) => {
  if (!document.body.classList.contains("cursor-propio")) {
    romboX = e.clientX;
    romboY = e.clientY;
    document.body.classList.add("cursor-propio");
  }
  mouseX = e.clientX;
  mouseY = e.clientY;
  rombo.classList.add("visible");
  hexFlotante.classList.add("visible");

  const valor = ((mouseX << 12) | mouseY) & 0xFFFFFF;
  hexFlotante.textContent = "0x" + valor.toString(16).toUpperCase().padStart(6, "0");
});

function seguirCursor() {
  romboX += (mouseX - romboX) * 0.2;
  romboY += (mouseY - romboY) * 0.2;
  rombo.style.transform = "translate(" + (romboX - 13) + "px, " + (romboY - 13) + "px) rotate(45deg)";
  hexFlotante.style.transform = "translate(" + (romboX + 26) + "px, " + (romboY + 30) + "px)";
  requestAnimationFrame(seguirCursor);
}
seguirCursor();

document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => rombo.classList.add("grande"));
  el.addEventListener("mouseleave", () => rombo.classList.remove("grande"));
});

const musica = document.getElementById("musica");
const botonPlay = document.getElementById("play");
musica.volume = 0.5;

botonPlay.addEventListener("click", () => {
  if (musica.paused) {
    musica.play().catch(() => {});
    botonPlay.innerHTML = "&#9208; Pause track";
    botonPlay.classList.add("sonando");
  } else {
    musica.pause();
    botonPlay.innerHTML = "&#9835; Play track";
    botonPlay.classList.remove("sonando");
  }
});

const spanVisitas = document.getElementById("visitas");

async function contarVisita() {
  try {
    const contador = new Counter({ version: "v1", namespace: "trenditexsas-perfil" });
    const res = await contador.up("visitas");
    spanVisitas.textContent = String(res.value).padStart(4, "0");
  } catch (error) {
    const n = Number(localStorage.getItem("visitas") || 0) + 1;
    localStorage.setItem("visitas", n);
    spanVisitas.textContent = String(n).padStart(4, "0");
  }
}
contarVisita();

const textoTitulo = "@trenditexsas";
let pos = 0;
let borrandoTitulo = false;

function animarTitulo() {
  document.title = textoTitulo.slice(0, pos) + "_";
  let espera = 200;

  if (!borrandoTitulo && pos === textoTitulo.length) {
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
