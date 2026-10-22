/* =========================================================
   Kova — écran d'accueil animé
   Le logo apparaît, pulse, puis s'efface pour laisser le site.
   ========================================================= */
(function () {
  var SPLASH_MS = 1900;   // durée d'affichage de l'écran
  var FADE_MS = 700;      // durée du fondu (doit correspondre au CSS)

  /* L'écran ne revient pas si l'on navigue dans le site */
  var deja = false;
  try { deja = sessionStorage.getItem('kova-splash') === '1'; } catch (e) { }

  var el = document.getElementById('splash');
  if (!el) return;

  function retirer() {
    if (el.dataset.parti) return;      // on ne retire qu'une fois
    el.dataset.parti = '1';
    el.classList.add('gone');
    document.body.classList.remove('splash-on');
    try { sessionStorage.setItem('kova-splash', '1'); } catch (e) { }
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, FADE_MS + 100);
  }

  if (deja) {                           // déjà vue dans cette visite
    if (el.parentNode) el.parentNode.removeChild(el);
    return;
  }

  /* L'écran est visible dès maintenant : pas d'attente du chargement
     des images, qui sont lourdes et prendraient plusieurs secondes. */
  document.body.classList.add('splash-on');

  /* Un clic ou une touche passe l'animation tout de suite */
  el.addEventListener('click', retirer);
  document.addEventListener('keydown', retirer, { once: true });

  /* Retrait programmé, sans dépendre de l'événement "load" */
  setTimeout(retirer, SPLASH_MS);

  /* La page peut arriver après : on affiche quand même le site */
  window.addEventListener('load', function () {
    if (el.dataset.parti) return;
    setTimeout(retirer, 300);
  });
})();
