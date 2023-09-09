import { getImages } from './js/pixabay-api';
import { Notify } from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

async function fetchImages(value) {
  const imagesArr = await getImages(value);

  if (imagesArr.length === 0) {
    return Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const markup = imagesArr
    .map(el => {
      return `<div class="photo-card">
        <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
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

  gallery.innerHTML = markup;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  gallery.innerHTML = '';

  const searchQuery = form.searchQuery.value;

  fetchImages(searchQuery);
});

gallery.addEventListener('click', e => {
  console.log(e.target);
});
