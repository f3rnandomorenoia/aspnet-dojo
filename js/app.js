// ASP.NET Dojo — motor de la app (SPA sin dependencias).

const XP_POR_EJERCICIO = 10;
const CLAVE_ESTADO = "aspnet-dojo-v1";

// ---------- Estado persistente ----------

function cargarEstado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ESTADO)) ?? estadoInicial();
  } catch {
    return estadoInicial();
  }
}

function estadoInicial() {
  return { xp: 0, racha: 0, ultimoDia: null, modulos: {} };
}

function guardarEstado() {
  localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
}

function progresoModulo(id) {
  return estado.modulos[id]?.completados ?? 0;
}

function registrarDia() {
  const hoy = new Date().toISOString().slice(0, 10);
  if (estado.ultimoDia === hoy) return;
  const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  estado.racha = estado.ultimoDia === ayer ? estado.racha + 1 : 1;
  estado.ultimoDia = hoy;
}

let estado = cargarEstado();

// ---------- Utilidades ----------

const $ = (sel) => document.querySelector(sel);

function el(tag, clase, texto) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto !== undefined) nodo.textContent = texto;
  return nodo;
}

function barajar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function vibrar(patron) {
  if (navigator.vibrate) navigator.vibrate(patron);
}

// ---------- Pantalla: inicio ----------

function renderInicio() {
  const app = $("#app");
  app.innerHTML = "";

  const cabecera = el("header", "cabecera");
  const marca = el("div", "marca");
  marca.append(el("span", "marca-logo", "{ }"), el("span", "marca-nombre", "ASP.NET Dojo"));
  const stats = el("div", "stats");
  stats.append(el("span", "stat", `🔥 ${estado.racha}`), el("span", "stat", `⚡ ${estado.xp} XP`));
  cabecera.append(marca, stats);

  const intro = el("p", "intro", "Aprende ASP.NET Core de .NET 10 desde el móvil, un ejercicio cada vez.");

  const lista = el("main", "modulos");
  let anteriorCompleto = true;

  CURSO.forEach((modulo) => {
    const hechos = progresoModulo(modulo.id);
    const total = modulo.ejercicios.length;
    const completo = hechos >= total;
    const bloqueado = !anteriorCompleto;

    const tarjeta = el("button", "modulo" + (completo ? " completo" : "") + (bloqueado ? " bloqueado" : ""));
    tarjeta.disabled = bloqueado;

    const icono = el("div", "modulo-icono", bloqueado ? "🔒" : modulo.icono);
    const info = el("div", "modulo-info");
    info.append(el("h2", null, modulo.titulo), el("p", null, modulo.descripcion));

    const barra = el("div", "barra");
    const relleno = el("div", "barra-relleno");
    relleno.style.width = `${(hechos / total) * 100}%`;
    barra.append(relleno);
    info.append(barra, el("span", "modulo-progreso", completo ? "✓ Completado" : `${hechos} / ${total}`));

    tarjeta.append(icono, info);
    tarjeta.addEventListener("click", () => iniciarLeccion(modulo));
    lista.append(tarjeta);

    anteriorCompleto = completo;
  });

  const pie = el("footer", "pie", "Tu progreso se guarda en este dispositivo.");
  app.append(cabecera, intro, lista, pie);
}

// ---------- Pantalla: lección ----------

let leccion = null; // { modulo, indice, aciertosNuevos }

function iniciarLeccion(modulo) {
  const hechos = progresoModulo(modulo.id);
  const indice = hechos >= modulo.ejercicios.length ? 0 : hechos; // repasar si ya está completo
  leccion = { modulo, indice, aciertosNuevos: 0, repaso: hechos >= modulo.ejercicios.length };
  renderEjercicio();
}

function renderEjercicio() {
  const { modulo, indice } = leccion;
  const ejercicio = modulo.ejercicios[indice];
  const app = $("#app");
  app.innerHTML = "";

  // Cabecera con salir + progreso
  const cabecera = el("header", "cabecera-leccion");
  const salir = el("button", "boton-salir", "✕");
  salir.addEventListener("click", renderInicio);
  const barra = el("div", "barra barra-leccion");
  const relleno = el("div", "barra-relleno");
  relleno.style.width = `${(indice / modulo.ejercicios.length) * 100}%`;
  barra.append(relleno);
  cabecera.append(salir, barra, el("span", "stat", `⚡ ${estado.xp}`));

  const zona = el("main", "zona-ejercicio");
  zona.append(el("p", "etiqueta-modulo", `${modulo.icono} ${modulo.titulo}`));

  const controlador =
    ejercicio.tipo === "quiz" ? montarQuiz(zona, ejercicio)
    : ejercicio.tipo === "huecos" ? montarHuecos(zona, ejercicio)
    : montarOrdenar(zona, ejercicio);

  // Pie con botón comprobar
  const pie = el("footer", "pie-leccion");
  const comprobar = el("button", "boton-primario", "Comprobar");
  comprobar.disabled = true;
  pie.append(comprobar);

  controlador.alCambiar = () => { comprobar.disabled = !controlador.listo(); };

  comprobar.addEventListener("click", () => {
    const correcto = controlador.evaluar();
    mostrarResultado(correcto, ejercicio, pie);
  });

  app.append(cabecera, zona, pie);
}

function mostrarResultado(correcto, ejercicio, pie) {
  vibrar(correcto ? 30 : [60, 40, 60]);
  pie.innerHTML = "";
  pie.className = "pie-leccion " + (correcto ? "correcto" : "incorrecto");

  const panel = el("div", "panel-resultado");
  panel.append(el("strong", null, correcto ? "¡Correcto! 🎉" : "No exactamente 🤔"));
  if (ejercicio.explicacion) panel.append(el("p", null, ejercicio.explicacion));

  const seguir = el("button", "boton-primario", correcto ? "Continuar" : "Reintentar");
  seguir.addEventListener("click", () => (correcto ? avanzar() : renderEjercicio()));
  pie.append(panel, seguir);
  seguir.focus();

  if (correcto) {
    const { modulo, indice, repaso } = leccion;
    estado.xp += XP_POR_EJERCICIO;
    registrarDia();
    if (!repaso) {
      const registro = (estado.modulos[modulo.id] ??= { completados: 0 });
      registro.completados = Math.max(registro.completados, indice + 1);
      leccion.aciertosNuevos++;
    }
    guardarEstado();
  }
}

function avanzar() {
  leccion.indice++;
  if (leccion.indice >= leccion.modulo.ejercicios.length) {
    renderFinal();
  } else {
    renderEjercicio();
  }
}

// ---------- Pantalla: fin de módulo ----------

function renderFinal() {
  const app = $("#app");
  app.innerHTML = "";
  const { modulo } = leccion;

  const pantalla = el("main", "pantalla-final");
  pantalla.append(
    el("div", "final-icono", modulo.icono),
    el("h1", null, `¡${modulo.titulo} completado!`),
    el("p", null, leccion.repaso ? "Buen repaso. La práctica hace al backend." : "Has desbloqueado el siguiente módulo."),
  );

  const resumen = el("div", "final-stats");
  resumen.append(
    el("span", "stat stat-grande", `⚡ ${estado.xp} XP`),
    el("span", "stat stat-grande", `🔥 ${estado.racha} día${estado.racha === 1 ? "" : "s"}`),
  );
  pantalla.append(resumen);

  const seguir = el("button", "boton-primario", "Volver al curso");
  seguir.addEventListener("click", renderInicio);
  pantalla.append(seguir);
  app.append(pantalla);
}

// ---------- Ejercicio: quiz ----------

function montarQuiz(zona, ejercicio) {
  zona.append(el("h1", "enunciado", ejercicio.pregunta));

  const orden = barajar(ejercicio.opciones.map((texto, i) => ({ texto, i })));
  let seleccion = null;
  const controlador = { listo: () => seleccion !== null, evaluar: () => seleccion.i === ejercicio.correcta };

  const lista = el("div", "opciones");
  orden.forEach((opcion) => {
    const boton = el("button", "opcion", opcion.texto);
    boton.addEventListener("click", () => {
      lista.querySelectorAll(".opcion").forEach((b) => b.classList.remove("elegida"));
      boton.classList.add("elegida");
      seleccion = opcion;
      controlador.alCambiar();
    });
    lista.append(boton);
  });
  zona.append(lista);
  return controlador;
}

// ---------- Ejercicio: huecos ----------

function montarHuecos(zona, ejercicio) {
  zona.append(el("h1", "enunciado", ejercicio.enunciado));

  const ranuras = []; // { nodo, ficha|null }
  const codigo = el("pre", "codigo");
  ejercicio.codigo.split(/(\{\d+\})/).forEach((parte) => {
    const hueco = parte.match(/^\{(\d+)\}$/);
    if (hueco) {
      const ranura = el("button", "ranura", "···");
      const indice = Number(hueco[1]);
      ranura.addEventListener("click", () => quitarDeRanura(indice));
      codigo.append(ranura);
      ranuras[indice] = { nodo: ranura, ficha: null };
    } else if (parte) {
      codigo.append(document.createTextNode(parte));
    }
  });

  const banco = el("div", "banco");
  barajar(ejercicio.banco).forEach((token) => {
    const ficha = el("button", "ficha", token);
    ficha.addEventListener("click", () => colocarEnRanura(ficha));
    banco.append(ficha);
  });

  const controlador = {
    listo: () => ranuras.every((r) => r.ficha),
    evaluar: () => ranuras.every((r, i) => r.ficha.textContent === ejercicio.respuestas[i]),
  };

  function colocarEnRanura(ficha) {
    const libre = ranuras.find((r) => !r.ficha);
    if (!libre) return;
    libre.ficha = ficha;
    libre.nodo.textContent = ficha.textContent;
    libre.nodo.classList.add("llena");
    ficha.classList.add("usada");
    ficha.disabled = true;
    controlador.alCambiar();
  }

  function quitarDeRanura(indice) {
    const ranura = ranuras[indice];
    if (!ranura.ficha) return;
    ranura.ficha.classList.remove("usada");
    ranura.ficha.disabled = false;
    ranura.ficha = null;
    ranura.nodo.textContent = "···";
    ranura.nodo.classList.remove("llena");
    controlador.alCambiar();
  }

  zona.append(codigo, el("p", "pista", "Toca una ficha para rellenar el siguiente hueco. Toca un hueco para vaciarlo."), banco);
  return controlador;
}

// ---------- Ejercicio: ordenar ----------

function montarOrdenar(zona, ejercicio) {
  zona.append(el("h1", "enunciado", ejercicio.enunciado));

  const respuesta = el("div", ejercicio.tokens ? "respuesta-tokens" : "respuesta-lineas");
  const banco = el("div", ejercicio.tokens ? "banco" : "banco banco-lineas");
  const colocadas = [];

  const controlador = {
    listo: () => colocadas.length === ejercicio.items.length,
    evaluar: () => colocadas.every((ficha, i) => ficha.textContent === ejercicio.items[i]),
  };

  barajar(ejercicio.items).forEach((texto) => {
    const ficha = el("button", ejercicio.tokens ? "ficha" : "ficha ficha-linea", texto);
    ficha.addEventListener("click", () => {
      if (ficha.parentElement === banco) {
        respuesta.append(ficha);
        colocadas.push(ficha);
      } else {
        banco.append(ficha);
        colocadas.splice(colocadas.indexOf(ficha), 1);
      }
      controlador.alCambiar();
    });
    banco.append(ficha);
  });

  zona.append(
    respuesta,
    el("p", "pista", "Toca las fichas en orden. Toca una colocada para devolverla."),
    banco,
  );
  return controlador;
}

// ---------- Arranque ----------

renderInicio();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
