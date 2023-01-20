const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
// app.use(morgan('tiny'))
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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)

    const foundPerson = persons.find((person) => person.id === personId)
    if(foundPerson){
        response.json(foundPerson)
    } else{
        response.status(404).json({ 
            error: 'the person does not exist' 
          })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)

    const foundPerson = persons.find((person) => person.id === personId)

    if(foundPerson){
        persons = persons.filter((person) => person.id !== personId)
        response.status(204).end()
    } else{
        response.status(404).json({ 
            error: 'content missing' 
          })
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name && body.number){
        const existingName = persons.find((person)=> person.name === body.name)
        const existingNumber = persons.find((person)=> person.number === body.number)
        if (existingName){
            response.status(404).json({ 
                error: 'the name already exists' 
              })
        } else if (existingNumber){
            response.status(404).json({ 
                error: 'the number already exists' 
              })
        } else{

            const newPerson = {
                id: Math.floor(Math.random() * 100),
                name: body.name,
                number: body.number,
            }
            persons = persons.concat(newPerson)
            response.json(newPerson)
        }
    } else {
        response.status(404).json({ 
            error: 'name or number missing' 
          })
    }
    morgan.token("body", (req, res) => JSON.stringify(req.body));
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
