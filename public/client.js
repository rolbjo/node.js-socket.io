const socket = io()

const userInput = document.querySelector('#userInput')
const messages = document.querySelector('#messages')
const form = document.querySelector('#form')
const input = document.querySelector('#input')
const dice = document.querySelector('#dice')
const diceThrows = document.querySelector('#diceThrows')
const diceTotal = document.querySelector('#diceTotal')

let user

dice.addEventListener('click', () => {
  let randDice = Math.floor(Math.random() * 6 + 1)
  user = userInput.value
  socket.emit('diceThrow', { user: user, dice: randDice })
  console.log(randDice)
})

socket.on('newDiceThrow', (value) => {
  let diceNumber = document.createElement('li')
  diceNumber.textContent =
    value.user + ':' + value.dice + ' (Total: ' + value.total + ')'
  diceThrows.appendChild(diceNumber)
})

formName.addEventListener('submit', function (e) {
  e.preventDefault()
  user = userInput.value
  userContainer.innerHTML = '<h2>Välkommen ' + user + '</h2>'
  document.getElementById('nameDiv').style.display = 'none'
  document.getElementById('formMessage').style.display = 'block'
})

formMessage.addEventListener('submit', function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit('chatMessage', { user: user, message: input.value })
    input.value = ''
  }
})

socket.on('newChatMessage', function (msg) {
  let item = document.createElement('li')
  item.textContent = msg.user + ':' + msg.message
  messages.appendChild(item)
})

socket.on('time', (timeMsg) => {
  clock.innerHTML = timeMsg
})
