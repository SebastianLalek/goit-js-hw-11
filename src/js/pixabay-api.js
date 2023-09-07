import axios from 'axios';

const url = 'https://pixabay.com/api/';
const apiKey = '39310150-ae6655c0c5d929a5c6e93be30';

export function getImages(str) {
  const params = {
    key: apiKey,
    q: str,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  };

  return axios.get(url, { params });
}

console.log(getImages('cat'));
