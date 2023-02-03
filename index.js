require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then((res) => {
    console.log(res.length)
    response.send(`<div> 
    <h3>Phonebook has info for ${res.length} people</h3>
    <p>${new Date()}</p>
    </div>`)
  })
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then((res) => {
    response.json(res)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then((pers) => {
    if(pers) {
      response.json(pers)
    } else {
      response.status(404).send({
        error: 'this id does not exists'
      })
    }
  })
  .catch((err) => next(err))

})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then((res) => response.status(204).end())
    .catch((error) => next(error))
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name && body.number){

      const newPerson = new Person({
        name: body.name,
        number: body.number,
      })
  
      newPerson.save().then((res) => {
        response.json(res)
      })
  
    } else {
        response.status(404).json({ 
            error: 'name or number missing' 
          })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
  const newNumber = request.body

  Person.findOneAndUpdate({_id: request.params.id}, newNumber, {new: true})
  .then((res) => {
    response.json(res)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })
})


app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
