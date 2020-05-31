const
   IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2',
   API_KEY = '89c9c2203fc448088d79aed52c7dc5a6',
   SERVER = 'https://api.themoviedb.org/3',
   leftMenu = document.querySelector('.left-menu'),
   hamburger = document.querySelector('.hamburger'),
   dropdown = document.querySelectorAll('.dropdown'),
   modal = document.querySelector('.modal'),
   modalTitle = document.querySelector('.modal__title'),
   modalLink = document.querySelector('.modal__link'),
   modalContent = document.querySelector('.modal__content'),
   tvShows = document.querySelector('.tv-shows'),
   tvCardImg = document.querySelector('.tv-card__img'),
   tvImgContent = document.querySelector('.image__content'),
   tvShowsList = document.querySelector('.tv-shows__list'),
   genresList = document.querySelector('.genres-list'),
   rating = document.querySelector('.rating'),
   description = document.querySelector('.description'),
   searchForm = document.querySelector('.search__form'),
   searchFormInput = document.querySelector('.search__form-input'),
   pagination = document.querySelector('.pagination'),
   preloader = document.querySelector('.preloader');

// preloader
const loading = document.createElement('div');
loading.className = 'loading';

class DBService {
   getData = async (url) => {
      const res = await fetch(url);
      if (res.ok) {
         return res.json();
      } else {
         throw new Error(`Не удалось получить данные по адресу ${url}`)
      }
   }

   getTestData = () => this.getData('test.json');
   getTestCard = () => this.getData('card.json');


   getTvShow = id => this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);

   getSearchResult = query => {
      this.temp = `${SERVER}/search/tv?api_key=${API_KEY}&language=ru-RU&query=${query}`;
      return this.getData(this.temp);
   };

   getTv = elem => {
      this.temp = `${SERVER}/tv/${elem}?api_key=${API_KEY}&language=ru-RU`;
      return this.getData(this.temp);
   };

   getNextPage = page => {
      return this.getData(this.temp + '&page=' + page);
   }
}

const dbService = new DBService();

const renderCard = (response, target) => {
   tvShowsList.textContent = '';

   tvShowsHead = document.querySelector('.tv-shows__head')
   if (!response.total_results) {
      searchFormInput.value;
      loading.remove();
      tvShowsHead.innerHTML = `<p>Поиск фразы <b>${searchFormInput.value}</b> ничего не дал :(</p>`;
      // tvShowsHead.style.cssText = 'color:red; ' // если нужно поменять стиль надписи
      searchFormInput.value = '';
      pagination.textContent = '';

      return
   }

   response.results.forEach(item => {
      const {
         backdrop_path: backdrop,
         name: title,
         poster_path: poster,
         vote_average: vote,
         id
      } = item;
      // проверка на наличие эдементов
      const posterIMG = poster ? IMG_URL + poster : '/img/no-poster.jpg',
         backdropIMG = backdrop ? IMG_URL + backdrop : '',
         voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

      const card = document.createElement('li');

      card.classList.add('tv-shows__item');
      card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
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
      searchFormInput.value = '';
      // если была нажата ссылка из меню, ставить в tvShowsHead ее имя
      tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
   })

   if (response.total_pages != 0 && response.total_pages <= 10) {
      pagination.textContent = '';
      for (let i = 1; i <= response.total_pages; i++) {
         pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
      }
   } else {
      pagination.textContent = '';
      for (let i = 1; i <= 10; i++) {
         pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
      }
   }

}

searchForm.addEventListener('submit', event => {
   event.preventDefault();
   const value = searchFormInput.value.trim(); //.trim() уберет пробелы
   if (value) {
      tvShows.append(loading);
      dbService.getSearchResult(value).then(renderCard);
   }
});

// menu
// открытие/закрытие меню
const closeDropdown = () => {
   for (let i = 0; i < dropdown.length; i++) {
      dropdown[i].classList.remove('active');
   }
}

hamburger.addEventListener('click', () => {
   leftMenu.classList.toggle('openMenu');
   hamburger.classList.toggle('open');
   closeDropdown();
});
// клик на всё кроме меню скрывает меню
document.addEventListener('click', e => {
   if (!e.target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      closeDropdown();
   }
});
// расскрываем список менюшки
leftMenu.addEventListener('click', e => {
   e.preventDefault();
   const target = e.target;
   const dropdown = target.closest('.dropdown');
   if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
   }

   // кнопки левого меню. обращаемся к dbService чепез getTv
   leftMenuTarget = (id, apiName) => {
      if (target.closest(id)) {
         dbService.getTv(apiName).then(response => renderCard(response, target));
      }
   }

   leftMenuTarget('#top-rated', 'top_rated');
   leftMenuTarget('#popular', 'popular');
   leftMenuTarget('#today', 'airing_today');
   leftMenuTarget('#week', 'on_the_air');

   if (target.closest('#search')) { // клик на ПОИСК в меню
      tvShowsList.textContent = '';
      tvShowsHead.textContent = '';
      pagination.textContent = '';
      document.querySelector('.search__form-input').focus(); // фокус на меню поиска
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
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

pagination.addEventListener('click', event => {
   event.preventDefault();
   const target = event.target;
   if (target) {
      tvShows.append(loading);
      dbService.getNextPage(target.textContent).then(renderCard);
   }

})

// MODAL
// открытие модального окна
tvShowsList.addEventListener('click', e => {
   e.preventDefault(); // чтобы страница при клике на ссылку не перезагружалась
   const target = e.target,
      card = target.closest('.tv-card');

   if (card) {
      preloader.style.display = 'block';

      tvShows.append(loading);
      // делаем запрос
      dbService.getTvShow(card.id)
         .then(({
            poster_path: posterPath,
            name: title,
            genres,
            vote_average: voteAverage,
            overview,
            homepage
         }) => {
            if (posterPath) {
               tvCardImg.src = IMG_URL + posterPath;
               modalContent.style.padding = '';
            } else {
               tvCardImg.src = tvImgContent.classList.add('hide');
               modalContent.style.padding = '35px';

            }
            tvCardImg.alt = title;
            modalTitle.textContent = title;
            genresList.textContent = ''
            // genresList.innerHTML = genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
            /* genres.forEach(item => {
               genresList.innerHTML += `<li>${item.name}</li>`;
                }) */
            for (const item of genres) {
               // '+=' добавляет к тому что есть еще поля, а не просто заменяет как '='
               genresList.innerHTML += `<li>${item.name}</li>`;
            }
            description.textContent = overview;
            rating.textContent = voteAverage;
            modalLink.href = homepage;
         })
         .then(() => {
            document.body.style.overflow = 'hidden'
            modal.classList.remove('hide')
            loading.remove()
         })
         .then(() => {
            preloader.style.display = '';
         })
   }
})

// закрытие модального
modal.addEventListener('click', e => {
   if (e.target.classList.contains('modal') || e.target.closest('.cross')) {
      tvImgContent.classList.remove('hide');
      document.body.style.overflow = '';
      modal.classList.add('hide');

   }
})