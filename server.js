const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = 3000

// Mongoose
const mongoose = require('mongoose')
const DiceModel = require('./models.js')

const start = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1/socketdatabase')
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
start()

app.use(express.static('public'))

// the endpoint to show info
app.get('/info', async (req, res) => {
  try {
    const userInfo = await DiceModel.find()
    return res.status(200).json(userInfo)
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
})

const userDiceThrows = {}

io.on('connection', (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`)

  socket.on('chatMessage', (msg) => {
    io.emit('newChatMessage', { user: msg.user, message: msg.message })
  })

  socket.on('diceThrow', (diceValue) => {
    const { user, dice } = diceValue
    if (!userDiceThrows.hasOwnProperty(user)) {
      userDiceThrows[user] = 0
    }
    userDiceThrows[user] += dice
    io.emit('newDiceThrow', {
      user: diceValue.user,
      dice: diceValue.dice,
      total: userDiceThrows[user],
    })
    // sparar till mongoDB med mongoose
    const newData = new DiceModel({
      user: user,
      dice: dice,
      total: userDiceThrows[user],
    })
    newData.save()
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`)
  })
})

server.listen(port, () => {
  console.log(`socket.IO server running at http://localhost:${port}/`)
})

setInterval(() => {
  let today = new Date()
  let time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  io.emit('time', time)
}, 1000)
