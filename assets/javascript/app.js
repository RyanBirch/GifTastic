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
      imgAnimatedSrc[i] = response.data[i].images.fixed_height.url
      imgStaticSrc[i] = response.data[i].images.fixed_height_still.url
      let rating = response.data[i].rating
      /*
      let image = $(`<img src=${imgStaticSrc[i]} class="gif-img" data-num=${i}>`)
      $('#gif-display').append(image).append(`<p class="rating">Rating: ${rating}</p>`)
      image.val('still')
      */
      // this is added
      let figure = $('<figure>')
      let image = $(`<img src=${imgStaticSrc[i]} class="gif-img" data-num=${i}>`)
      image.val('still')
      let ratingCap = $(`<figcaption class="rating">Rating: ${rating}</figcaption>`)
      figure.append(image).append(ratingCap)
      $('#inner-container').append(figure)
      // added code ends here
    }
    // $('#gif-container').prepend('<figure id="gif-display">')
    // this is added
    $('#gif-container').prepend(`<div id="inner-container">`)
    // added code ends here
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
