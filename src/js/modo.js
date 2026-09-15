/* ═══════════════════════════════════════════════════════════════════════
   MODO DE LA PÁGINA
   presentacion → anuncia el lanzamiento y enlaza a las tiendas (activo hoy).
   waitlist     → muestra el formulario de correo con su consentimiento.

   Se cambia en el HTML, no aquí:
       <body data-modo="presentacion">  →  <body data-modo="waitlist">

   ANTES de activar waitlist hacen falta dos cosas que hoy no existen:
     1. La política de privacidad publicada en /legal/privacidad.html
        (obligatoria en España para recoger correos — RGPD).
     2. Un destino donde guardar los correos: el atributo action del
        formulario está vacío a propósito.

   Este archivo solo se ocupa de que lo oculto quede fuera del recorrido de
   teclado y de los lectores de pantalla. Ocultarlo con CSS no basta.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var modo = document.body.getAttribute('data-modo') || 'presentacion';
  var fuera = modo === 'presentacion' ? '.solo-waitlist' : '.solo-presentacion';

  document.querySelectorAll(fuera).forEach(function (bloque) {
    bloque.setAttribute('aria-hidden', 'true');
    bloque.querySelectorAll('a, button, input, select, textarea').forEach(function (f) {
      f.setAttribute('tabindex', '-1');
      if ('disabled' in f) f.disabled = true;   // no se envía lo que está oculto
    });
  });
})();
