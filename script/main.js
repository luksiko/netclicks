// menu

const leftMenu = document.querySelector('.left-menu'),
   hamburger = document.querySelector('.hamburger'),
   dropdown = document.querySelectorAll('.dropdown'),
   tvCardImg = document.querySelectorAll('.tv-card__img');

// открытие/закрытие меню

hamburger.addEventListener('click', () => {
   leftMenu.classList.toggle('openMenu');
   hamburger.classList.toggle('open');
   for (let i = 0; i < dropdown.length; i++) {
      dropdown[i].classList.remove('active');
   }
});
// клик на 
document.addEventListener('click', e => {
   if (!e.target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      for (let i = 0; i < dropdown.length; i++) {
         dropdown[i].classList.remove('active');
      }
   }
});
// расскрываем список менюшки
leftMenu.addEventListener('click', e => {
   const target = e.target;
   const dropdown = target.closest('.dropdown');
   if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
   }
})
for (let i = 0; i < tvCardImg.length; i++) {
   const newSrc = tvCardImg[i].src;

   tvCardImg[i].addEventListener('mouseenter', function() {
      console.dir('mouseenter');
      tvCardImg[i].src = this.dataset.backdrop;
   })

   tvCardImg[i].addEventListener('mouseleave',  function() {
      tvCardImg[i].src = newSrc;
   })

}