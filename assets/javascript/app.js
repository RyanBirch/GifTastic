let savedFavArray = []  // favorites will be saved here
let page = 0  // for loading a new page of gifs

// don't show these buttons until we load gifs
$('#prev-page').hide()
$('#next-page').hide()

// if we have favorites in local storage, they will go into this array
let arr = JSON.parse(localStorage.getItem('savedFavArray'))
if (arr) {
  savedFavArray = arr
}

// get input from user and run search
$('#add-gif').on('click', function() {
  event.preventDefault()
  let topic = $('#gif-input').val().trim()
  searchGifs(topic)
})

// fetch gifs from the api and display them on screen
async function searchGifs(topic) {
  let key = 'TUOzKgx9bjMSFVmrVSQ3d619fQIY6iG3'
  let limit = 20
  let offset = page * limit
  let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=${limit}&offset=${offset}`

  // call api
  let response = await $.get(queryURL)

  // create structure of gifs display
  for (let i = 0; i < limit; i++) {
    let imgAnimatedSrc = response.data[i].images.fixed_height.url
    let imgStaticSrc = response.data[i].images.fixed_height_still.url
    let rating = response.data[i].rating
    let figure = $('<figure>')
    let image = $(`<img src=${imgAnimatedSrc} class="gif-img" data-state="animated" data-still=${imgStaticSrc} data-animated=${imgAnimatedSrc}>`)
    let ratingCap = $(`<figcaption class="rating">Rating: ${rating}</figcaption>`)
    let favButton = $(`<button class="fav-button" data-state="still" data-still=${imgStaticSrc} data-animated=${imgAnimatedSrc}>&#9733; Favorite</button>`)
    ratingCap.append(favButton)
    figure.append(image).append(ratingCap)
    $('#results').append(figure)
  }

  // show next page or prev page buttons
  if (page === 0) {
    $('#next-page').show()
  } else {
    $('#prev-page').show()
    $('#next-page').show()
  }
}

function nextPage() {
  page++
  $('#results').empty()
  let topic = $('#gif-input').val().trim()
  searchGifs(topic)
}

function prevPage() {
  page--
  $('#results').empty()
  let topic = $('#gif-input').val().trim()
  searchGifs(topic)
}

// pause or animate gifs when you click on them
function changeSrc() {
  if ($(this).attr('data-state') === 'still') {
    $(this).attr('src', $(this).attr('data-animated'))
    $(this).attr('data-state', 'animated')
  } else {
    $(this).attr('src', $(this).attr('data-still'))
    $(this).attr('data-state', 'still')
  }
}

// clear gifs from the main screen
$('#clear-gifs').on('click', function() {
  $('#results').empty()
  $('#gif-input').val('')
  page = 0
  $('#prev-page').hide()
  $('#next-page').hide()
})

// add gifs to your favorites list and save them in local storage
function addToFavs() {
  let imgAnimatedSrc = $(this).attr('data-animated')
  let imgStaticSrc = $(this).attr('data-still')
  let figure = $('<figure>')
  let img = $(`<img src=${imgStaticSrc} class="gif-img" data-state="still" data-still=${imgStaticSrc} data-animated=${imgAnimatedSrc}>`)
  figure.append(img)
  let cap = $('<figcaption>')
  let remove = $(`<button class="remove-button">Remove</button>`)
  cap.append(remove)
  figure.append(cap)
  $('#favorites-display').append(figure)

  let favSave = figure.html()
  savedFavArray.push(favSave)
  localStorage.clear()
  localStorage.setItem('savedFavArray', JSON.stringify(savedFavArray))
}

// remove selected favorites from the screen and local storage
function removeFav() {
  $(this).parent().parent().remove()
  let thisSrc = $(this).parent().siblings('img').attr('src')

  let arr = JSON.parse(localStorage.getItem('savedFavArray'))

  for (let i = 0; i < arr.length; i++) {
    let figure = $('<figure>')
    figure.append(arr[i])
    let currentElemSrc = figure.find('img').attr('src')

    if (thisSrc === currentElemSrc) {
      arr.splice(i, 1)
      localStorage.clear()
      localStorage.setItem('savedFavArray', JSON.stringify(arr))
    }
  }
}

// remove all favorites from the screen and local storage
$('#clear-favorites').on('click', function() {
  $('#favorites-display').empty()
  localStorage.clear()
})

// display favorites that are saved in local storage
function displaySavedFavs() {
  let arr = JSON.parse(localStorage.getItem('savedFavArray'))
  if (arr) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
      $('#favorites-display').append($('<figure>').append(arr[i]))
    }
  }
}

$(document).on('click', '.gif-img', changeSrc)
$(document).on('click', '#prev-page', prevPage)
$(document).on('click', '#next-page', nextPage)
$(document).on('click', '.fav-button', addToFavs)
$(document).on('click', '.remove-button', removeFav)

displaySavedFavs()