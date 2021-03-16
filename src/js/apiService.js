const API_KEY = '20634365-1f280baa9861a1cbb9baba7ac';
const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
  }

  fetchImages() {
    const url = `${BASE_URL}&key=${API_KEY}&q=${this.searchQuery}&per_page=${this.perPage}&page=${this.page}`;
    return fetch(url)
      .then(response => response.json())
      .then(({ hits, totalHits }) => {
        // console.log(totalHits, hits);
        return { hits, totalHits };
      });
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

  set query(q) {
    this.searchQuery = q;
  }
}
