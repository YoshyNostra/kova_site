/* =========================================================
   Kova — écran d'accueil animé
   Le logo apparaît, pulse, puis s'efface pour laisser le site.
   À placer juste après l'ouverture de <body> dans index.html,
   et le script est chargé avant </body>.
   ========================================================= */
(function () {
  var SPLASH_MS = 1900;   // durée d'affichage avant le fondu
  var FADE_MS = 700;      // durée du fondu (doit correspondre au CSS)

  /* On n'affiche l'écran qu'une fois par visite (pas à chaque changement de page) */
  var deja = false;
  try { deja = sessionStorage.getItem('kova-splash') === '1'; } catch (e) { }

  var el = document.getElementById('splash');

  function retirer() {
    if (!el) return;
    el.classList.add('gone');
    document.body.classList.remove('splash-on');
    try { sessionStorage.setItem('kova-splash', '1'); } catch (e) { }
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, FADE_MS + 100);
  }

  if (!el || deja) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    document.body.classList.remove('splash-on');
    return;
  }

  document.body.classList.add('splash-on');

  /* Un clic ou une touche passe l'animation tout de suite */
  var passer = function () { retirer(); };
  el.addEventListener('click', passer);
  document.addEventListener('keydown', passer, { once: true });

  /* Départ après chargement, ou tout de suite si la page est déjà prête */
  function lancer() { setTimeout(retirer, SPLASH_MS); }
  if (document.readyState === 'complete') lancer();
  else window.addEventListener('load', lancer);

  /* Filet de sécurité : si quelque chose bloque, on retire quand même */
  setTimeout(retirer, SPLASH_MS + 2500);
})();
