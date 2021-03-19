import './css/bootstrap.min.css';
import './css/common.css';
import 'material-design-icons/iconfont/material-icons.css';
// import LoadMoreBtn from './js/components/loadMoreBtn';

import ApiService from './js/apiService';
import galleryTmplt from './tmplates/gallery.hbs';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  // moreBtn: document.querySelector('[data-action="load-more"]'),
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  results: document.querySelector('.results'),
  guardScroll: document.querySelector('.guard'),
};

const imagesApi = new ApiService();

const onEnlarge = e => {
  if (e.target.nodeName != 'IMG') return;
  const imgSrc = e.target.dataset.source;
  basicLightbox.create(`<img width="1200" src="${imgSrc}">`).show();
};

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onEnlarge);

console.log(refs.gallery);

async function onSearch(e) {
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.query.value;
  imagesApi.resetPage();
  refs.gallery.innerHTML = '';

  const { hits, totalHits } = await imagesApi.fetchImages();
  refs.results.innerHTML = `Results: ${totalHits}`;

  appendImages(hits);
  imagesApi.incrementPage();
  // totalHits > 12 ? loadMoreBtn.show() : loadMoreBtn.hide();
}

function appendImages(images) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTmplt(images));
}

// Load more with infinie scroll
const onEntry = entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && imagesApi.query != '') {
      const { hits } = await imagesApi.fetchImages();
      appendImages(hits);
      imagesApi.incrementPage();
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.guardScroll);

// Load more with button

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

// refs.moreBtn.addEventListener('click', onMore);

// function onMore(e) {
//   loadMoreBtn.disable();

//   imagesApi.fetchImages().then(({ hits }) => {
//     appendImages(hits);
//     loadMoreBtn.show();
//     loadMoreBtn.enable();
//     imagesApi.incrementPage();
//      window.scrollTo(0,document.body.scrollHeight)
//   });
// }
