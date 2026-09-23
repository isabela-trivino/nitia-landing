/* ═══════════════════════════════════════════════════════════════════════
   MEDICIÓN · Google Analytics 4, detrás del aviso de cookies

   ▸ PARA ENCENDERLA: pegar el identificador de medición de Nítia en ID_GA4
     (formato 'G-XXXXXXXXXX'). Es la ÚNICA línea que hay que tocar.
   ▸ Con ID_GA4 vacío: no aparece el aviso de cookies, no se descarga nada de
     Google y la página no pone ninguna cookie. No hay nada que consentir.

   Comprobado en una copia de pruebas el 21-09-2026 (ver
   COOKIES-DECISIONES-Y-DISENO.md, apartado 3 bis): antes de decidir y tras
   rechazar, cero cookies y cero peticiones a Google; con «sí» a la analítica,
   solo _ga y _ga_<id>, a 13 meses; al revocar, se borran.

   Reglas que cumple este archivo:
   1. Modo de consentimiento v2 de Google, versión BÁSICA: todo empieza
      denegado y el código de Google NO se descarga hasta que hay un «sí».
   2. Cookie de 13 meses contados desde la primera visita, sin prórroga
      automática (criterio de la guía de la AEPD).
   3. Señales de Google solo si se acepta también la publicidad.
   4. Al retirar el consentimiento se borran las cookies de Google que ya
      estuvieran puestas y la página se recarga.

   Se carga ANTES que consentimiento.js: este archivo avisa de si la
   medición está activa y escucha la decisión que aquel emite.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ID_GA4 = '';                       // ← p. ej. 'G-XXXXXXXXXX'. Vacío = todo apagado.
  var TRECE_MESES = 34128000;            // 395 días, en segundos

  // consentimiento.js lee esta marca: sin medición, no hay aviso que mostrar.
  window.NITIA_MEDICION_ACTIVA = !!ID_GA4;
  if (!ID_GA4) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  var cargado = false;

  function senales(d) {
    var si = function (v) { return v ? 'granted' : 'denied'; };
    return {
      analytics_storage:  si(d.analitica),
      ad_storage:         si(d.publicidad),
      ad_user_data:       si(d.publicidad),
      ad_personalization: si(d.publicidad)
    };
  }

  function cargarGoogle(d) {
    cargado = true;
    gtag('consent', 'update', senales(d));
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_GA4;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ID_GA4, {
      cookie_expires: TRECE_MESES,
      cookie_update: false,
      allow_google_signals: !!d.publicidad,
      allow_ad_personalization_signals: !!d.publicidad
    });
  }

  var PATRON = /^(_ga|_gid|_gat|_gcl_|_fbp|_fbc)/;

  function cookiesDeTerceros() {
    return document.cookie.split(';')
      .map(function (c) { return c.split('=')[0].trim(); })
      .filter(function (n) { return PATRON.test(n); });
  }

  function borrarCookies() {
    // Google pone sus cookies en el dominio más alto que puede; se prueba en
    // todos los niveles para no dejar ninguna viva.
    var partes = location.hostname.split('.');
    var dominios = [''];
    for (var i = 0; i < partes.length - 1; i++) {
      var dom = partes.slice(i).join('.');
      dominios.push(dom, '.' + dom);
    }
    cookiesDeTerceros().forEach(function (nombre) {
      dominios.forEach(function (dom) {
        document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
                          (dom ? '; domain=' + dom : '');
      });
    });
  }

  document.addEventListener('nitia:consentimiento', function (ev) {
    var d = ev.detail;
    if (d.analitica) {
      if (!cargado) cargarGoogle(d);
      else gtag('consent', 'update', senales(d));
      return;
    }
    gtag('consent', 'update', senales(d));
    borrarCookies();
    if (cargado) location.reload();   // el código de Google ya estaba en la página
  });

  // ── Eventos propios. Se apuntan siempre en dataLayer, pero solo llegan a
  //    Google si el código se ha descargado, es decir, si hubo un «sí».
  function evento(nombre, datos) { gtag('event', nombre, datos || {}); }

  document.querySelectorAll('a[href^="#"]:not(.saltar):not([data-cookies])').forEach(function (a) {
    a.addEventListener('click', function () {
      evento('clic_navegacion', { destino: a.getAttribute('href') });
    });
  });

  document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) {
    a.addEventListener('click', function () { evento('clic_instagram'); });
  });

  document.querySelectorAll('.acordeon__cabeza').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-expanded') === 'false') {
        evento('abre_pregunta', { pregunta: b.textContent.trim().slice(0, 80) });
      }
    });
  });

  // Profundidad de lectura. Se llama «lectura» y no «scroll» porque la
  // medición mejorada de GA4 ya envía su propio «scroll» al 90 %.
  (function () {
    var marcas = [25, 50, 75, 100], vistas = {}, pendiente = false;
    function medir() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var pct = alto > 0 ? (window.scrollY / alto) * 100 : 100;
      marcas.forEach(function (m) {
        if (pct >= m && !vistas[m]) { vistas[m] = true; evento('lectura', { porcentaje: m }); }
      });
      pendiente = false;
    }
    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(medir);
    }, { passive: true });
  })();
})();
