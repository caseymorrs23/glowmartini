(function(){
  const header = document.querySelector('header');
  const btn = document.querySelector('[data-nav-toggle]');
  if(btn){
    btn.addEventListener('click', () => header.classList.toggle('open'));
  }
  // Close menu when clicking a link
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => header.classList.remove('open'));
  });
})();
