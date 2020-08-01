'use strict';





const GOOGLE_BOOK_SEARCH_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  
function getDataFromGoogleBooksApi(book) {
  let url = GOOGLE_BOOK_SEARCH_URL + book;
  const query = {
    key: 'AIzaSyCXn1s41z5eUTYyq5L2JAc4YZpao_7ephk',
    q: book,
      
    limit: 'maxResults',
    orderBy: 'relevance'
  };
  fetch(url)
  .then(res => {
    if(!res.ok){
      throw new Error()
    }
    return res.json()
    })
    .then(responseJson => displayBooks(responseJson))
    .catch((e) => {
      $('#gb-results').html("");
      $('#gb-results').append(`
        <div class="channel goog">Google-Books</div>
      `);

      $('#gb-results').append(`<h2>Sorry, no results!</h2>`);
    })
}



function displayBooks( result ){
  // console.log(result)
   $('#gb-results').html(" ");
   $('#gb-results').append(`
     <div class="channel goog">Google-Books</div>
  `);

      result.items.forEach((item) => {
        $('#gb-results').append(`
        <div class="gb-row">
          <div class="gb-1">
            <a href="${item.volumeInfo.canonicalVolumeLink}" target="_blank"><img class="gb-thumbs" src="
            ${item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 
            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRI_-WvjF1ELri4w-r9umQI0JBiSNS-j1-J4w&usqp=CAU'}"></a>
          </div>
          <div class="gb-2">
            <h2 class="gb-title">Title: ${item.volumeInfo.title}</h2>
            <h4>Author: ${item.volumeInfo.authors}</h4>
            <p class="gb-info">${item.volumeInfo.subtitle}</p>
          </div>
        </div>
      `);
      });
}


const WIKI_SEARCH_URL = 'https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts%7Cpageimages&exsentences=3&list=&titles=';
  
function getDataFromWikiApi(authorName) {
  const url = WIKI_SEARCH_URL + authorName;
  // console.log(url)
  const queryData = "";
   
  fetch(url, {
    headers: {
    'Content-Type': 'application/json',
  },
  }).then(res => {
    if(!res.ok) {
      throw new Error()
    }
    return res.json()
  })
  .then(responseJson => displayAuthor(responseJson))
  .catch((e) => {
    $('#wiki-results').html("");
    $('#wiki-results').append(`<div class="channel wiki">Author Details</div>`);
    $('#wiki-results').append(`<p>Try to be more specific!</p>`);
  });
  
}

function displayAuthor(data ){
  $('#wiki-results').html(" ");
  $('#wiki-results').append(`<div class="channel wiki">Author Details</div>`);

  let pages = data.query.pages;
  // console.log(pages);
   
    for (let id in pages) {
      if(pages[id] == undefined) {
        consol.log("there is no id, its undefined");
          $('#wiki-results').append('<p>Try your search again.</p>');
      }


      if (pages[id].thumbnail == undefined) {
        // console.log("there is no thumbnail source, its undefined");

      }

      if (pages[id].thumbnail !== undefined) {  
        $('#wiki-results').append(`<img class="wiki-pic" src="${pages[id].thumbnail.source}">`);
      }

      if (pages[id].extract == "") {
        $('#wiki-results').append(`<h2>Sorry, no results!</h2>`);
      }

      if (pages[id].extract) {
        $('#wiki-results').append(`<h2 class="card">${pages[id].title}</h2>`);
        $('#wiki-results').append(`<p>${pages[id].extract}</p>`);
      } 

      else {
        // console.log("its undefined");
        $('#wiki-results').append(`<p>Try to be more specific!</p>`);
      } 

      
  
    }
}

function watchForm() {
  $('#js-form').submit((event) => {
    event.preventDefault();

    $('#results').removeClass('hidden');
    let authorName =  $('.author-input').val();
    let book = $('.title-input').val();

    if(authorName) {
      getDataFromWikiApi(authorName);
      $('#gb-results').hide();
      $('#wiki-results').show()
    }else if(book) {
      getDataFromGoogleBooksApi(book);
      $('#wiki-results').hide();
      $('#gb-results').show();
    }else {
      return
    }
    
  });
}
function displayInfo() {
  $('#js-info').on('click', () => {
  $('#moreInfo').toggle();
}); 

}

function displayInputs() {
  $('.author-input').hide()
  $('input[type="radio"]').on('change',(e)=> {
    let value = $(e.currentTarget).val()
    if(value === 'author') {
      $('.author-input').show()
       $('.author-input').prop('required', true)
      $('.title-input').prop('required', false)
      $('.title-input').hide()
      $('.title-input').val('')
    } else {
      $('.author-input').hide()
      $('.author-input').val('')
      $('.title-input').show()
      $('.title-input').prop('required', true)
      $('.author-input').prop('required', false)
    }
  })
}

$(
  watchForm(),
  displayInputs(),
  displayInfo()
);

















