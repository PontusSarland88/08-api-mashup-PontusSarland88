/* Code goes here */
import './styles/app.scss';

class Mashed {
  constructor(element) {
    this.root = element;
    this.addEventListeners();
  }
  
  addEventListeners() {
    const searchBtn = document.getElementById('search-button');
    searchBtn.addEventListener('click', () => {
      var search = document.getElementById('search-value');
      this.fetchFlickrPhotos(search.value);
      this.fetchWordlabWords(search.value);
    });

    const sidebarWords = document.querySelectorAll('aside ul li a');
  
      sidebarWords.forEach((sidebarWord) => {
        sidebarWord.addEventListener('click', () => {
          var targetValue = event.target.innerHTML;
          document.getElementById('search-value').value = targetValue;
          this.fetchFlickrPhotos(targetValue);
          this.fetchWordlabWords(targetValue);
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
      var aEl = document.createElement('a');
      var imgEl = document.createElement('img');
      aEl.href = `${element.url_m}`;
      imgEl.src = `${element.url_m}`;
      aEl.appendChild(imgEl);
      liEl.appendChild(aEl);
      liEl.classList.add("result");
      fragment.appendChild(liEl);
    });
    el.appendChild(fragment);
  }

  renderWorldlab(wordlabResponse) {
    let words = Object.keys(wordlabResponse).map(key => {
      return Object.values(wordlabResponse[key]).map(word => {
        return word;
      });
    });

    words = flatten(words);

    var el = document.querySelector('aside ul');
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    var fragment = document.createDocumentFragment();
    var maxWordCounter = 0; 
    for (let i = 0; i < 10; i++) {
      let liEl = document.createElement('li');
      let link = document.createElement('a');
      link.href = "#";
      link.textContent = words[i];
      liEl.appendChild(link);
      fragment.appendChild(liEl);

    }
    el.appendChild(fragment);
    this.addEventListeners();
  }

  fetchFlickrPhotos(query) {
    let resourceUrl =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=';
    let flickrAPIkey = process.env.FLICKR_API_KEY;

    let flickrQueryParams =
      '&text=' + query +
      '&sort=relevance&extras=url_m&format=json&nojsoncallback=1';
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
      .catch(function(error) {
        alert('There has been a problem with your wordlab fetch operation, try another search');
      }
      )};
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

function flatten(array) {
  const flat = [].concat(...array);
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

(function() {
  new Mashed(document.querySelector('#mashed'));
})();