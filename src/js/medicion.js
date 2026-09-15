/* ═══════════════════════════════════════════════════════════════════════
   MEDICIÓN · Google Analytics 4

   El identificador todavía no existe: sale del setup técnico, que está a la
   espera de los accesos del Cliente. La etiqueta queda instalada y apagada.

   Para encenderla, una sola línea — la de aquí abajo. Nada más.

   Con ID_GA4 vacío no se carga ningún recurso de Google y la página no envía
   un solo dato: por eso se puede publicar hoy sin aviso de cookies.
   Los eventos se registran igualmente en dataLayer y GA4 los recoge en
   cuanto haya identificador.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ID_GA4 = '';          // ← p. ej. 'G-XXXXXXXXXX'. Vacío = medición apagada.

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  if (ID_GA4) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_GA4;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ID_GA4, {
      anonymize_ip: true,
      allow_google_signals: false    // sin señales de publicidad hasta tener aviso de cookies
    });
  }

  function evento(nombre, datos) { gtag('event', nombre, datos || {}); }

  // Navegación interna
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      evento('clic_navegacion', { destino: a.getAttribute('href') });
    });
  });

  // Salida a Instagram
  document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) {
    a.addEventListener('click', function () { evento('clic_instagram'); });
  });

  // Apertura de preguntas — dice qué dudas pesan más antes de descargar
  document.querySelectorAll('.acordeon__cabeza').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-expanded') === 'false') {
        evento('abre_pregunta', { pregunta: b.textContent.trim().slice(0, 80) });
      }
    });
  });

  // Registro en la lista de espera — solo existe en modo waitlist
  var form = document.querySelector('.formulario');
  if (form) form.addEventListener('submit', function () { evento('registro_waitlist'); });

  // Profundidad de lectura: si la página se lee entera o se abandona arriba
  (function () {
    var marcas = [25, 50, 75, 100], vistas = {}, pendiente = false;
    function medir() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var pct = alto > 0 ? (window.scrollY / alto) * 100 : 100;
      marcas.forEach(function (m) {
        if (pct >= m && !vistas[m]) { vistas[m] = true; evento('scroll', { porcentaje: m }); }
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
