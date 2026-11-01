class PixabayApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.apiKey = '56879126-87842d423c76b37188bb0260f';
    }

    async fetchImages() {
        const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${encodeURIComponent(this.searchQuery)}&page=${this.page}&per_page=12&key=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Помилка підключення до сервера');
            }
            const data = await response.json();
            this.incrementPage();
            return data.hits;
        } catch (error) {
            console.error('Помилка під час отримання зображень:', error);
            throw error;
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

// Ініціалізація сервісу та DOM-елементів
const pixabayApiService = new PixabayApiService();

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// Обробка сабміту форми пошуку
async function onSearch(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const query = form.elements.query.value.trim();

    if (!query) {
        alert('Введіть ключове слово для пошуку!');
        return;
    }

    pixabayApiService.query = query;
    pixabayApiService.resetPage();
    clearGallery();

    try {
        const images = await pixabayApiService.fetchImages();

        if (images.length === 0) {
            alert('За вашим запитом нічого не знайдено.');
            refs.loadMoreBtn.classList.add('is-hidden');
            return;
        }

        appendGalleryMarkup(images);
        refs.loadMoreBtn.classList.remove('is-hidden');
    } catch (error) {
        alert('Сталася помилка при завантаженні. Спробуйте пізніше.');
    }
}

// Обробка натискання на кнопку "Load more"
async function onLoadMore() {
    try {
        const images = await pixabayApiService.fetchImages();

        appendGalleryMarkup(images);

        // Плавний скрол сторінки
        const lastCard = refs.gallery.lastElementChild;
        if (lastCard) {
            lastCard.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    } catch (error) {
        alert('Не вдалося завантажити додаткові зображення.');
    }
}

// Генерація розмітки однієї картки
function createImageCardTemplate({ webformatURL, likes, views, comments, downloads }) {
    return `
    <li class="photo-card">
      <img src="${webformatURL}" alt="" />
      <div class="stats">
        <p class="stats-item">
          <i class="material-icons">thumb_up</i>
          ${likes}
        </p>
        <p class="stats-item">
          <i class="material-icons">visibility</i>
          ${views}
        </p>
        <p class="stats-item">
          <i class="material-icons">comment</i>
          ${comments}
        </p>
        <p class="stats-item">
          <i class="material-icons">cloud_download</i>
          ${downloads}
        </p>
      </div>
    </li>
  `;
}

// Рендер карток у галерею
function appendGalleryMarkup(images) {
    const markup = images.map(image => createImageCardTemplate(image)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

// Очищення галереї при новому пошуку
function clearGallery() {
    refs.gallery.innerHTML = '';
}