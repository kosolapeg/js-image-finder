import './css/bootstrap.min.css';
import './css/common.css';
import 'material-design-icons/iconfont/material-icons.css';
import LoadMoreBtn from './js/components/loadMoreBtn';
import ApiService from './js/apiService';
import galleryTmplt from './tmplates/gallery.hbs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  results: document.querySelector('.results'),
  // moreBtn: document.querySelector('[data-action="load-more"]'),
  guardScroll: document.querySelector('.guard'),
};

const imagesApi = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.query.value;

  imagesApi.fetchImages().then(({ hits, totalHits }) => {
    refs.results.innerHTML = `Results: ${totalHits}`;
    refs.gallery.innerHTML = '';

    appendImages(hits);

    // totalHits > 12 ? loadMoreBtn.show() : loadMoreBtn.hide();
  });
}

function appendImages(images) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTmplt(images));
}

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
//   });
// }

// Load more with infinie scroll

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApi.query != '') {
      imagesApi.fetchImages().then(({ hits }) => {
        appendImages(hits);
        imagesApi.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.guardScroll);
