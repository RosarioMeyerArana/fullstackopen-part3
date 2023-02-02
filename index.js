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


let persons = [
        { 
          name: "Arto Hellas", 
          number: "040-123456",
          id: 1
        },
        { 
          name: "Ada Lovelace", 
          number: "39-44-5323523",
          id: 2
        },
        { 
          name: "Dan Abramov", 
          number: "12-43-234345",
          id: 3
        },
        { 
          name: "Mary Poppendieck", 
          number: "39-23-6423122",
          id: 4
        }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<div> 
    <h3>Phonebook has info for ${persons.length} people</h3>
    <p>${new Date()}</p>
    </div>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((res) => {
    response.json(res)
  })
})

app.get('/api/persons/:id', (request, response) => {

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
  .catch((err) => {
    response.status(400).send({ error: 'malformatted id' })
  })

})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then((res) => response.status(204).end())
    .catch((err) =>  response.status(400).send({ 
      error: 'malformatted id' 
    }))
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


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
