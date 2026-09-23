/* ═══════════════════════════════════════════════════════════════════════
   CONSENTIMIENTO DE COOKIES

   - Si la medición está apagada (ID_GA4 vacío en medicion.js), no muestra
     nada: ni aviso ni enlace «Configurar cookies». No hay nada que consentir.
   - Si está activa y no hay una decisión válida guardada, muestra el aviso.
   - Guarda la decisión en el navegador. Guardar la decisión NO necesita
     consentimiento: es estrictamente necesario (guía de cookies de la AEPD).
   - La decisión caduca a los 12 MESES, tanto si fue «sí» como si fue «no».
   - Si cambian las cookies o sus finalidades, se sube VERSION y se vuelve a
     preguntar a todo el mundo.
   - Emite «nitia:consentimiento» con la decisión; medicion.js la escucha.
   - En la página de cookies, rellena el bloque [data-estado-cookies] con la
     situación real de cada visitante.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE   = 'nitia-consentimiento';
  var VERSION = 1;                                // subir al cambiar cookies o finalidades
  var VIGENCIA_MS = 365 * 24 * 60 * 60 * 1000;    // 12 meses
  var ACTIVA  = !!window.NITIA_MEDICION_ACTIVA;

  var aviso = document.getElementById('aviso-cookies');
  var panel = document.getElementById('panel-cookies');
  var swAnalitica  = document.getElementById('cookies-analitica');
  var swPublicidad = document.getElementById('cookies-publicidad');
  var estado = document.querySelector('[data-estado-cookies]');

  function leer() {
    try {
      var d = JSON.parse(localStorage.getItem(CLAVE));
      if (!d || d.version !== VERSION) return null;
      if (Date.now() - d.fecha > VIGENCIA_MS) return null;
      return d;
    } catch (e) { return null; }
  }

  function pintarEstado(d) {
    if (!estado) return;
    if (!ACTIVA) {
      estado.textContent = 'Ahora mismo este sitio no tiene activada ninguna ' +
        'cookie de analítica ni de publicidad, así que no hay nada que aceptar.';
      return;
    }
    if (!d) { estado.textContent = 'Todavía no has tomado ninguna decisión.'; return; }
    estado.textContent = 'Tu decisión actual: analítica, ' + (d.analitica ? 'aceptada' : 'rechazada') +
      '; publicidad, ' + (d.publicidad ? 'aceptada' : 'rechazada') + '.';
  }

  // Sin medición: se ocultan los enlaces de configuración y se termina aquí.
  if (!ACTIVA) {
    document.querySelectorAll('[data-cookies="configurar"]').forEach(function (a) {
      // Se oculta el contenedor (el <li> del pie o la envoltura marcada), no
      // solo el enlace, para que no queden separadores huérfanos.
      (a.closest('li, [data-cookies-envoltura]') || a).hidden = true;
    });
    pintarEstado(null);
    return;
  }

  function aplicar(d) {
    document.dispatchEvent(new CustomEvent('nitia:consentimiento', { detail: d }));
    pintarEstado(d);
  }

  function guardar(analitica, publicidad) {
    var d = { version: VERSION, fecha: Date.now(),
              analitica: !!analitica, publicidad: !!publicidad };
    try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) {}
    aplicar(d);
  }

  function abrirPanel() {
    var d = leer();
    swAnalitica.checked  = d ? d.analitica  : false;   // nada viene marcado
    swPublicidad.checked = d ? d.publicidad : false;
    if (typeof panel.showModal === 'function') panel.showModal();
    else panel.setAttribute('open', '');
  }

  function decidir(analitica, publicidad) {
    guardar(analitica, publicidad);
    if (aviso) aviso.hidden = true;
    if (panel.open) panel.close();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cookies]');
    if (!b) return;
    var accion = b.getAttribute('data-cookies');
    if (accion === 'rechazar')   decidir(false, false);
    if (accion === 'aceptar')    decidir(true, true);
    if (accion === 'configurar') { e.preventDefault(); abrirPanel(); }
    if (accion === 'guardar')    decidir(swAnalitica.checked, swPublicidad.checked);
  });

  var previa = leer();
  if (previa) { aplicar(previa); }
  else { if (aviso) aviso.hidden = false; pintarEstado(null); }
})();
