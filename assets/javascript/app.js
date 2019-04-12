let topics = ['dog', 'cat', 'horse', 'chicken']

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
  let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=20`

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    console.log(response)
    for (let i = 0; i < 20; i++) {
      // desktop size
      $('#gif-display').append(`<img src=${response.data[i].images.original.url}>`)
    }
  })
}

$(document).on('click', '.topic', displayGifs);

displayButtons()
