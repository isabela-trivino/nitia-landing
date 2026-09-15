/* ═══════════════════════════════════════════════════════════════════════
   MICROINTERACCIONES
   Solo comportamiento visual. Nivel acordado: medio.
   Ninguna función de este archivo es necesaria para leer la página: si el
   script no carga, todo queda visible y utilizable.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Marca que hay JavaScript. El CSS lo usa para no ocultar nada si falla.
  document.documentElement.classList.add('js');

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · Aparición al entrar en pantalla ──────────────────────────── */
  var apariciones = document.querySelectorAll('[data-aparece]');

  if (quieto || !('IntersectionObserver' in window)) {
    apariciones.forEach(function (el) { el.setAttribute('data-visible', 'si'); });
  } else {
    // Escalona los hijos de cada grupo: 0, 70, 140 ms…
    document.querySelectorAll('.escalonado').forEach(function (grupo) {
      Array.prototype.forEach.call(grupo.children, function (hijo, i) {
        hijo.style.setProperty('--i', i);
      });
    });

    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-visible', 'si');
        vigia.unobserve(e.target);          // una sola vez: no reaparece al subir
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    apariciones.forEach(function (el) { vigia.observe(el); });
  }

  /* ── 2 · Cabecera pegada ──────────────────────────────────────────── */
  var cabecera = document.querySelector('.cabecera');
  if (cabecera) {
    var pendiente = false;
    var revisar = function () {
      cabecera.setAttribute('data-fijada', window.scrollY > 24 ? 'si' : 'no');
      pendiente = false;
    };
    revisar();
    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(revisar);   // como mucho una vez por fotograma
    }, { passive: true });
  }

  /* ── 3 · Acordeón ─────────────────────────────────────────────────── */
  /* Se construye con <button> y no con <details> para poder animar la
     altura con grid-template-rows. El estado accesible lo lleva
     aria-expanded, y el contenido se oculta con hidden cuando está cerrado
     para que los lectores de pantalla no lo lean de más. */
  document.querySelectorAll('.acordeon').forEach(function (acordeon) {
    var cabeza = acordeon.querySelector('.acordeon__cabeza');
    var caja   = acordeon.querySelector('.acordeon__caja');
    if (!cabeza || !caja) return;

    var abrir = function (si) {
      acordeon.setAttribute('data-abierto', si ? 'si' : 'no');
      cabeza.setAttribute('aria-expanded', si ? 'true' : 'false');
      if (si) {
        caja.removeAttribute('inert');
      } else {
        caja.setAttribute('inert', '');
      }
    };

    abrir(acordeon.getAttribute('data-abierto') === 'si');
    cabeza.addEventListener('click', function () {
      abrir(acordeon.getAttribute('data-abierto') !== 'si');
    });
  });

  /* ── 4 · Menú: marca la sección en la que estás ───────────────────── */
  var enlaces = document.querySelectorAll('.menu a[href^="#"]');
  if (enlaces.length && 'IntersectionObserver' in window) {
    var porId = {};
    enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });

    var marcador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var a = porId[e.target.id];
        if (a) a.setAttribute('aria-current', e.isIntersecting ? 'true' : 'false');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(porId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) marcador.observe(s);
    });
  }
})();
