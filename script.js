// --- AOS init ---
AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 60 });

// --- Preloader logic ---
(function () {
  const fill = document.getElementById('loaderFill');
  const text = document.getElementById('loaderText');
  const loader = document.getElementById('preloader');

  const steps = [
    { at: 0,   msg: 'Inicjalizacja systemu...' },
    { at: 25,  msg: 'Łączenie z serwerami Otomoto i OLX...' },
    { at: 60,  msg: 'Skanowanie okazji w 16 województwach...' },
    { at: 90,  msg: 'Kalibracja łowcy...' },
  ];

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 9 + 4;
    if (progress >= 100) progress = 100;
    fill.style.width = progress + '%';

    const step = [...steps].reverse().find(s => progress >= s.at);
    if (step) text.textContent = step.msg;

    if (progress >= 100) {
      clearInterval(timer);
      text.textContent = 'Gotowe. Witaj, łowco. ✅';
      setTimeout(() => {
        loader.classList.add('hidden-loader');
        document.body.style.overflow = '';
        setTimeout(() => loader.remove(), 800);
      }, 500);
    }
  }, 180);

  // blokada scrolla podczas ładowania
  document.body.style.overflow = 'hidden';
})();

// Zabezpieczenia strony
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || (e.ctrlKey && e.key === 'U')) {
    e.preventDefault();
  }
});
