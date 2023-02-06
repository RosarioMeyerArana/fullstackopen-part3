const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(() => console.log('connected'))
  .catch((e) => console.log('error connecting: ', e))

const personSchema = new mongoose.Schema({
  name: { type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  number: { type: String,
    minlength: 8,
  },
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON' , {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)