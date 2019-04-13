let topics = ['dog', 'chicken', 'octopus', 'panda']
let imgAnimatedSrc = []
let imgStaticSrc = []

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
      // desktop size
      imgAnimatedSrc[i] = response.data[i].images.original.url
      imgStaticSrc[i] = response.data[i].images.original_still.url
      let rating = response.data[i].rating
      let image = $(`<img src=${imgStaticSrc[i]} class="gif-img" data-num=${i}>`)
      $('#gif-display').append(image).append(`<p class="rating">Rating: ${rating}</p>`)
      image.val('still')
      // $('#gif-display').append(`<img src=${imgStaticSrc[i]} class="gif-img" value="still" data-num=${i}>`)
      // .append(`<p class="rating">Rating: ${rating}</p>`)
    }
    $('#gif-container').prepend('<div id="gif-display">')
  })
}

function changeSrc() {
  if ($(this).val() === 'still') {
    $(this).attr('src', imgAnimatedSrc[$(this).attr('data-num')])
    $(this).val('animated')
  } else {
    $(this).attr('src', imgStaticSrc[$(this).attr('data-num')])
    $(this).val('still')
  }
}

$(document).on('click', '.topic', displayGifs)
$(document).on('click', '.gif-img', changeSrc)

displayButtons()
