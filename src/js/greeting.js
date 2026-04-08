/* ============================================================
   GREETING — time-of-day greeting
   ============================================================ */

(function () {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('greeting');
  if (el) el.textContent = g + '.';
})();
