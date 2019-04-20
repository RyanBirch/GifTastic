let topics = ['dog', 'chicken', 'octopus', 'panda']
let savedFavArray = []

function displayButtons() {
  $('#buttons-display').empty()
  let topicsLength = topics.length
  for (let i = 0; i < topicsLength; i++) {
    let button = $('<button>')
    button.addClass('topic')
    button.attr('data-name', topics[i])
    button.text(topics[i])
    $('#buttons-display').append(button)
  }
}

$('#add-gif').on('click', function() {
  event.preventDefault()
  let topic = $('#gif-input').val().trim()
  topics.push(topic)
  displayButtons()
  $('#gif-input').val('')
})

function displayGifs() {
  let key = 'TUOzKgx9bjMSFVmrVSQ3d619fQIY6iG3'
  let topic = $(this).attr('data-name')
  let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=10`

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

function changeSrc() {
  if ($(this).attr('data-state') === 'still') {
    $(this).attr('src', $(this).attr('data-animated'))
    $(this).attr('data-state', 'animated')
  } else {
    $(this).attr('src', $(this).attr('data-still'))
    $(this).attr('data-state', 'still')
  }
}

$('#clear-gifs').on('click', function() {
  $('#inner-container').siblings('#inner-container').empty()
})

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
  localStorage.setItem('savedFavArray',JSON.stringify(savedFavArray))
}

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

$('#clear-favorites').on('click', function() {
  $('#favorites-display').empty()
  localStorage.clear()
})

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
