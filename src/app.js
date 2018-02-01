/* Code goes here */
import './styles/app.scss';


class Mashed {
  constructor(element) {
    this.root = element;
    this.addEventListeners();
  }
  
  addEventListeners() {
    const searchBtn = document.getElementById('search-button');
    var promiseStack = [];
    searchBtn.addEventListener('click', () => {
      var search = document.getElementById('search-value');
      // promiseStack = [
        this.fetchFlickrPhotos(search.value),
        this.fetchWordlabWords(search.value)
      // ];
      // debugger;
      // getPromiseData(promiseStack)
      // .then((result) => {
      //   console.log(result); 
      // });
      // this.renderFlickr(flickrResponse);
      // this.renderWorldlab(wordlabResponse);
    });

    const sidebarWords = document.querySelectorAll('aside ul li a');
  
      sidebarWords.forEach((sidebarWord) => {
        sidebarWord.addEventListener('click', function() {
          // TODO: Trigger flickr and word api fetch with Promise.all()
        });
      });
  }

  renderFlickr(flickrResponse) {
    var el = document.querySelector('.results ul');
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    var fragment = document.createDocumentFragment();
    flickrResponse.photos.photo.map(element => {
      var liEl = document.createElement('li');
      liEl.style.backgroundImage = `url(${element.url_m})`;
      liEl.classList.add("result");
      fragment.appendChild(liEl);
    });
    el.appendChild(fragment);
  }
  renderWorldlab(wordlabResponse) {

  }

  fetchFlickrPhotos(query) {
    let resourceUrl =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=';
    let flickrAPIkey = process.env.FLICKR_API_KEY;

    let flickrQueryParams =
      '&text=' + query +
      '&extras=url_m&format=json&nojsoncallback=1';
    let flickrUrl = resourceUrl + flickrAPIkey + flickrQueryParams;
    
    return fetch(flickrUrl)
      .then(res => res.json())
      .then(res => {
        console.log('Got response from FlickR!');
        this.renderFlickr(res);
      })
      .catch(err => console.error(err));
  }

  fetchWordlabWords(query) {
    let wordLabAPIkey = process.env.WORDLABB_API_KEY;
    let wordLabUrl = `http://words.bighugelabs.com/api/2/${wordLabAPIkey}/${query}/json`;

   return fetch(wordLabUrl)
      .then(res => res.json())
      .then(res => {
        console.log('Got response from BigHugeLabs!');
        this.renderWorldlab(res);
      })
      .catch(err => console.error(err));
  }
}

function getPromiseData(promises) {
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(res => {
        return res.map( type => type.json() );
      })
      .then(res => {
        Promise.all(res)
          .then(resolve)
      })
      .catch(reject);
  });
}

(function() {
  new Mashed(document.querySelector('#mashed'));
})();