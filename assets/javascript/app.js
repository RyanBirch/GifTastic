let animals = ['dog', 'cat', 'horse', 'chicken']

function makeButtons() {
  $('#buttons-display').empty()
  let animalsLength = animals.length
  for (let i = 0; i < animalsLength; i++) {
    let button = $('<button>')
    button.addClass('animal')
    button.attr('data-name', animals[i])
    button.text(animals[i])
    $('#buttons-display').append(button)
  }
}

$('#add-gif').on('click', function() {
  event.preventDefault()
  let animal = $('#gif-input').val().trim()
  animals.push(animal)
  makeButtons()
  $('#gif-input').val('')
})

function displayGifs() {
  
}

makeButtons()
