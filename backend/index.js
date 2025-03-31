const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

let notes = [
    {
      id: "1",
      content: "HTML is easy, but boring",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
    response.json(notes)
})


app.get('/api/notes/:idNumber', (request, response) => {
    const id = request.params.idNumber
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: 'content missing' })
    }
    
    const note = {
        content: body.content,
        important : body.important || false,
        id: generateId()
    }
    
    notes = notes.concat(note)

    response.json(note)
})

//This middleware will be used for This middleware handles requests to any routes that haven’t been defined (i.e., non-existent routes).
//It runs at the end so it ensures that if a route isnt found, it will return a 404 status code and a message indicating that the endpoint is unknown.
const unkownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}
app.use(unkownEndPoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
