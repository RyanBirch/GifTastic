let topics = ['dog', 'chicken', 'octopus', 'panda']

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
    let imgAnimatedSrc = []
    let imgStaticSrc = []
    for (let i = 0; i < 10; i++) {
      // desktop size
      imgAnimatedSrc[i] = response.data[i].images.original.url
      imgStaticSrc[i] = response.data[i].images.original_still.url
      $('#gif-display').append(`<img src=${imgStaticSrc[i]} id="gif-img" val="still" data-num=${i}>`)
      // $('#gif-display').append(`<img src=${response.data[i].images.original.url}>`)
    }
    $('#gif-container').prepend('<div id="gif-display">')
  })
}

$('#gif-img').on('click', function() {
  if ($(this).attr('val') === 'still') {
    $(this).attr('src', imgAnimatedSrc[data-num])
    $(this).attr('val', 'animated')
  } else {
    $(this).attr('src', imgStaticSrc[data-num])
    $(this).attr('val', 'still')
  }
})

$(document).on('click', '.topic', displayGifs);

displayButtons()
