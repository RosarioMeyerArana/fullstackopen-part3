const express = require('express')
const app = express()

app.use(express.json())

const persons = [
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
        response.status(404).end()
    }
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
