import { getImages } from './js/pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

let searchQuery;
let currentPage = 1;
let totalHits;
let lightbox;

async function fetchImages(value, page) {
  const imagesData = await getImages(value, page);
  const imagesArr = imagesData.hits;
  totalHits = imagesData.totalHits;

  const markup = imagesArr
    .map(el => {
      return `<div class="photo-card">
        <a href="${el.largeImageURL}"><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${el.downloads}
          </p>
        </div>
      </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox = new SimpleLightbox('.gallery a');
  showNotification();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  currentPage = 1;

  gallery.innerHTML = '';

  searchQuery = form.searchQuery.value;

  fetchImages(searchQuery, currentPage);
});

gallery.addEventListener('click', e => e.preventDefault());

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    currentPage += 1;
    fetchImages(searchQuery, currentPage);
  }

  lightbox.refresh();
});

function showNotification() {
  if (totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (totalHits > 0 && currentPage === 1) {
    return Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (gallery.children.length === totalHits) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
