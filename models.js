const mongoose = require('mongoose')

const DiceSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  dice: {
    type: Number,
  },
  total: {
    type: Number,
  },
})

module.exports = mongoose.model('dice', DiceSchema)
