import { getImages } from './js/pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery;
let currentPage = 1;
let totalHits;
let lightbox;

async function fetchImages(value, page) {
  const imagesData = await getImages(value, page);
  const imagesArr = imagesData.hits;
  totalHits = imagesData.totalHits;

  if (imagesArr.length === 0) {
    loadMoreBtn.classList.add('hidden');
    return Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

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

  if (currentPage === 1) {
    lightbox = new SimpleLightbox('.gallery a');
    return Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  lightbox.refresh();
}

form.addEventListener('submit', e => {
  e.preventDefault();

  currentPage = 1;

  gallery.innerHTML = '';

  searchQuery = form.searchQuery.value;

  fetchImages(searchQuery, currentPage);

  loadMoreBtn.classList.remove('hidden');
});

loadMoreBtn.addEventListener('click', e => {
  currentPage += 1;
  fetchImages(searchQuery, currentPage);
});

if (gallery.children.length === totalHits) {
  loadMoreBtn.classList.add('hidden');
  return Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

gallery.addEventListener('click', e => e.preventDefault());
