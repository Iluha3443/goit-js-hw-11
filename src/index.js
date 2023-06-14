import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-input');
const parentEl = document.querySelector('.gallery');

formEl.addEventListener('submit', onSubmitForm);

const myKey = '37292159-607e55aeb61a23e05d40a5fe8';
const params = {
     method: 'GET',
    key: myKey,
    q: inputEl.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
};


function onSubmitForm(e) {
    e.preventDefault();
  return  fetch('https://pixabay.com/api/?key=${myKey}', params)
        .then(r => r.json())
        .then(data => console.log(data))
        .catch(erorr => console.log(erorr))
}