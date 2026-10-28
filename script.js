let zMax = 10;

function traerAlFrente(ventana) {
    zMax++;
    ventana.style.zIndex = zMax;
}

document.querySelectorAll(".icono").forEach(icono => {
    icono.addEventListener("click", () => {
        const ventana = document.getElementById(icono.dataset.ventana);
        ventana.classList.add("abierta");
        traerAlFrente(ventana);
    });
});

document.querySelectorAll(".cerrar").forEach(boton => {
    boton.addEventListener("click", () => {
        boton.closest(".ventana").classList.remove("abierta");
    });
});

document.querySelectorAll(".ventana").forEach(ventana => {
    const barra = ventana.querySelector(".barra-titulo");
    let dx = 0, dy = 0;

    ventana.addEventListener("pointerdown", () => traerAlFrente(ventana));

    barra.addEventListener("pointerdown", (e) => {
        if (e.target.classList.contains("cerrar")) return;
        dx = e.clientX - ventana.offsetLeft;
        dy = e.clientY - ventana.offsetTop;
        barra.setPointerCapture(e.pointerId);

        barra.onpointermove = (ev) => {
            ventana.style.left = (ev.clientX - dx) + "px";
            ventana.style.top = (ev.clientY - dy) + "px";
        };
        barra.onpointerup = () => {
            barra.onpointermove = null;
            barra.onpointerup = null;
        };
    });
});

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const COLOR = "#00ff41";
const TAMANO = 16;
const CARACTERES = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789".split("");

let columnas, gotas;

function ajustarLienzo() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columnas = Math.floor(canvas.width / TAMANO);
    gotas = Array.from({ length: columnas }, () => Math.random() * -50);
}
ajustarLienzo();
window.addEventListener("resize", ajustarLienzo);

function dibujarLluvia() {
    ctx.fillStyle = "rgba(5, 5, 10, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = COLOR;
    ctx.font = TAMANO + "px monospace";

    for (let i = 0; i < columnas; i++) {
        const letra = CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
        ctx.fillText(letra, i * TAMANO, gotas[i] * TAMANO);

        if (gotas[i] * TAMANO > canvas.height && Math.random() > 0.975) {
            gotas[i] = 0;
        }
        gotas[i]++;
    }
}
setInterval(dibujarLluvia, 50);

const entrada = document.getElementById("entrada");
const musica = document.getElementById("musica");
const botonVolumen = document.getElementById("volumen");

entrada.addEventListener("click", () => {
  entrada.classList.add("oculta");
  musica.volume = 0.5;
  musica.play().catch(() => {});

  document.querySelectorAll(".ventana").forEach((ventana, i) => {
    setTimeout(() => {
      ventana.classList.add("abierta");
      traerAlFrente(ventana);
    }, i * 300);
  });
});

botonVolumen.addEventListener("click", () => {
    musica.muted = !musica.muted;
    botonVolumen.textContent = musica.muted ? "♪ OFF" : "♪ ON";
});

function actualizarReloj() {
    document.getElementById("reloj").textContent =
        new Date().toLocaleTimeString("es-MX", { hour12: false });
}
actualizarReloj();
setInterval(actualizarReloj, 1000);

const cursor = document.getElementById("cursor");
setInterval(() => {
    cursor.style.visibility = cursor.style.visibility === "hidden" ? "visible" : "hidden";
}, 500);

const textoTitulo = "@trenditexsas";
let pos = 0;
let borrando = false;

function animarTitulo() {
    document.title = textoTitulo.slice(0, pos) + "_";
    let espera = 200;

    if (!borrando && pos === textoTitulo.length) {
        borrando = true;
        espera = 1500;
    } else if (borrando && pos === 0) {
        borrando = false;
        espera = 600;
    } else {
        pos += borrando ? -1 : 1;
    }

    setTimeout(animarTitulo, espera);
}
animarTitulo();