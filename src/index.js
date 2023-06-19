import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');
const parentEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', onSubmitForm);

const gallery = new SimpleLightbox('.simple', {
  captionsData: 'alt',
  captionDelay: 250,
});
const myKey = '37292159-607e55aeb61a23e05d40a5fe8';
let currentPage = 1;
loadMoreBtn.style.display = 'none';
const params = {
  method: 'GET',
  key: myKey,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: currentPage,
};

loadMoreBtn.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  params.page += 1;

  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${myKey}`, { params });
    const requiredValues = response.data.hits.map(data => ({
      webformatURL: data.webformatURL,
      largeImageURL: data.largeImageURL,
      tags: data.tags,
      likes: data.likes,
      views: data.views,
      comments: data.comments,
      downloads: data.downloads
    }));
if (params.page * params.per_page >= response.data.totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    createMarkup(requiredValues);
    gallery.refresh();

    
  } catch (error) {
    console.log(error);
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  params.page += 1;
  parentEl.innerHTML = '';
  loadMoreBtn.style.display = 'none';


  if (params.q !== inputEl.value) {
    params.page = 1;
  }

  params.q = inputEl.value;
  
  try {
    const response = await axios.get(`https://pixabay.com/api/?key=${myKey}`, { params });
    const requiredValues = response.data.hits.map(data => ({
      webformatURL: data.webformatURL,
      largeImageURL: data.largeImageURL,
      tags: data.tags,
      likes: data.likes,
      views: data.views,
      comments: data.comments,
      downloads: data.downloads
    }));

    if (!requiredValues || requiredValues.length === 0) {
      if (params.page === 1) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }
    } else {
      Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
      loadMoreBtn.style.display = 'block';
    }

    createMarkup(requiredValues);
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(info) {
  const markupValues = info.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
      <a href="${largeImageURL}" class="simple"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes:${likes}</b>
        </p>
        <p class="info-item">
          <b>Views:${views}</b>
        </p>
        <p class="info-item">
          <b>Comments:${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads:${downloads}</b>
        </p>
      </div>
    </div>`;
  }).join('');
  parentEl.insertAdjacentHTML('beforeend', markupValues);
}
