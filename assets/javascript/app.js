let topics = ['dog', 'chicken', 'octopus', 'panda']
let savedFavArray = []

// savedFavArray will hold what's in local storage
let arr = JSON.parse(localStorage.getItem('savedFavArray'))
if (arr) {
  savedFavArray = arr
}

// display topic buttons from array
function displayButtons() {
  $('#buttons-display').empty()
  let topicsLength = topics.length
  for (let i = 0; i < topicsLength; i++) {
    let button = $('<button>')
    button.addClass('topic')
    button.attr('data-name', topics[i])
    button.attr('data-clicked', '0')
    button.text(topics[i])
    $('#buttons-display').append(button)
  }
}

// add a topic to the buttons display
$('#add-gif').on('click', function() {
  event.preventDefault()
  let topic = $('#gif-input').val().trim()
  topics.push(topic)
  displayButtons()
  $('#gif-input').val('')
})

// fetch gifs from the api and display them on screen
function displayGifs() {
  let key = 'TUOzKgx9bjMSFVmrVSQ3d619fQIY6iG3'
  let topic = $(this).attr('data-name')
  let numClicked = parseInt($(this).attr('data-clicked'))
  let offset = numClicked * 10
  $(this).attr('data-clicked', numClicked + 1)
  let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=10&offset=${offset}`

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response)

    for (let i = 0; i < 10; i++) {
      let imgAnimatedSrc = response.data[i].images.fixed_height.url
      let imgStaticSrc = response.data[i].images.fixed_height_still.url
      let rating = response.data[i].rating
      let figure = $('<figure>')
      let image = $(`<img src=${imgStaticSrc} class="gif-img" data-state="still" data-still=${imgStaticSrc} data-animated=${imgAnimatedSrc}>`)
      let ratingCap = $(`<figcaption class="rating">Rating: ${rating}</figcaption>`)
      let favButton = $(`<button class="fav-button" data-state="still" data-still=${imgStaticSrc} data-animated=${imgAnimatedSrc}>&#9733; Favorite</button>`)
      ratingCap.append(favButton)
      figure.append(image).append(ratingCap)
      $('#inner-container').append(figure)
    }
    $('#gif-container').prepend(`<div id="inner-container">`)
  })
}

// animate gifs when you click on them
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
  $('#inner-container').siblings('#inner-container').empty()
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

$(document).on('click', '.topic', displayGifs)
$(document).on('click', '.gif-img', changeSrc)
$(document).on('click', '.fav-button', addToFavs)
$(document).on('click', '.remove-button', removeFav)

displayButtons()
displaySavedFavs()
