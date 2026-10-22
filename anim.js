/* =========================================================
   Kova — déclenchement des animations au défilement
   Fichier indépendant : ne modifie aucun autre script du site.
   Pour tout désactiver : supprimez la ligne <script src="anim.js">
   dans index.html. Le site redevient exactement comme avant.
   ========================================================= */
(function () {
  'use strict';

  var racine = document.documentElement;

  /* Si le navigateur ne sait pas observer le défilement, on ne fait RIEN :
     le site s'affiche normalement, sans animation. Aucun risque. */
  if (!('IntersectionObserver' in window)) return;

  /* Si la personne a demandé moins d'animations dans son système,
     on ne fait rien non plus. */
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduit) return;

  /* Les éléments à animer, dans l'ordre où ils apparaissent.
     Les sélecteurs visent les blocs existants du site : aucun HTML à modifier. */
  var CIBLES = [
    '.hero h1', '.hero p', '.hero .btn',
    '.sec .h2-xl', '.sec .lead', '.stat',
    '.tabs',
    '.plans .plan',
    '.contact h3', '.contact p', '.contact .btn',
    '.ft-brand', '.ft-col', '.ft-bot'
  ];

  function preparer() {
    /* On active les styles d'animation seulement maintenant : si ce script
       ne s'exécute pas, la classe n'est jamais posée et rien n'est masqué. */
    racine.classList.add('anim-ready');

    var elements = [];
    CIBLES.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (elements.indexOf(el) === -1) elements.push(el);
      });
    });

    /* Les trois cartes d'offres apparaissent en cascade */
    document.querySelectorAll('.plans .plan').forEach(function (el, i) {
      el.classList.add('rv-d' + Math.min(i + 1, 3));
    });

    elements.forEach(function (el) { el.classList.add('rv'); });

    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('rv-in');
          observateur.unobserve(e.target); /* on ne rejoue pas : pas de clignotement */
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach(function (el) { observateur.observe(el); });

    /* Filet de sécurité : si un élément n'a jamais été détecté
       (mise en page particulière), on l'affiche au bout de 3 secondes. */
    setTimeout(function () {
      elements.forEach(function (el) {
        if (!el.classList.contains('rv-in')) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add('rv-in');
        }
      });
    }, 3000);
  }

  /* On attend que la page soit construite avant de chercher les éléments. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preparer);
  } else {
    preparer();
  }
})();
