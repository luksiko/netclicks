const leftMenu = document.querySelector('.left-menu'),
   hamburger = document.querySelector('.hamburger'),
   dropdown = document.querySelectorAll('.dropdown'),
   tvCardImg = document.querySelectorAll('.tv-card__img'),
   tvShowsList = document.querySelector('.tv-shows__list'),
   modal = document.querySelector('.modal'),
   tvShows = document.querySelector('.tv-shows'),
   IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2',
   API_KEY = '89c9c2203fc448088d79aed52c7dc5a6';

// preloader
const loading = document.createElement('div');
loading.className = 'loading';

console.log(loading);

const DBService = class {
   getData = async (url) => {
      const res = await fetch(url);
      console.log(res);
      if (res.ok) {
         return res.json();
      } else {
         throw new Error(`Не удалось получить данные по адресу ${url}`)
      }
   }

   getTestData = () => {
      return this.getData('test.json')
   }
}

const renderCard = response => {
   console.log(response);
   tvShowsList.textContent = '';

   response.results.forEach(item => {

      const {
         backdrop_path: backdrop,
         name: title,
         poster_path: poster,
         vote_average: vote
      } = item;
// проверка на наличие эдементов
      const posterIMG = poster ? IMG_URL + poster : '/img/no-poster.jpg',
         backdropIMG = backdrop ? IMG_URL + backdrop : '';
         voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

/*          if (vote !== 0) {
            voteElem = vote
         } else {
            voteElem = '';
         }
    */


      console.log('item: ', item);
      const card = document.createElement('li');
      card.classList.add('tv-shows__item');
      card.innerHTML = `
      <a href="#" class="tv-card">
      ${voteElem}
         <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
      </a>   
      `;
      loading.remove()
      tvShowsList.append(card); // метод вставляет элемент в html аналог inseartAjasmentElement
   })

}
{
   tvShows.append(loading);
new DBService().getTestData().then(renderCard);
}
// menu


// открытие/закрытие меню

hamburger.addEventListener('click', () => {
   leftMenu.classList.toggle('openMenu');
   hamburger.classList.toggle('open');
   for (let i = 0; i < dropdown.length; i++) {
      dropdown[i].classList.remove('active');
   }
});
// клик на всё кроме меню скрывает меню
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
});

// смена картинки при наведении 
//! моё решение
/* for (let i = 0; i < tvCardImg.length; i++) {
   // записываем в константу путь к изображению
   const newSrc = tvCardImg[i].src;
   // меняем путь к изображению на датасет
   tvCardImg[i].addEventListener('mouseenter', function () {
      setTimeout(() => {
         this.src = this.dataset.backdrop;
      }, 200)
   })
   // возвращаем правильный путь из константы newSrc
   tvCardImg[i].addEventListener('mouseleave', function () {
      setTimeout(() => {
         this.src = newSrc;
      }, 200)
   })
}; */

//! решение ментора
const changeImage = event => {
   const card = event.target.closest('.tv-shows__item');
   if (card) {
      const img = card.querySelector('.tv-card__img');

      if (img.dataset.backdrop) { // если нет второй картинки, не меняем
         // деструктуризация. Меняем местами переменные
         [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
      }
   }
}
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);


// MODAL
// открытие модального окна
tvShowsList.addEventListener('click', e => {
   e.preventDefault(); // чтобы страница при клике на ссылку не перезагружалась и не шло вверх
   const target = e.target,
      card = target.closest('.tv-card');
   if (card) {
      document.body.style.overflow = 'hidden'
      modal.classList.remove('hide')
   }
})

// закрытие 
modal.addEventListener('click', e => {
   if (e.target.classList.contains('modal') || e.target.closest('.cross')) {
      document.body.style.overflow = '';
      modal.classList.add('hide');
   }
})