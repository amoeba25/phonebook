const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body'));

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//api route to get the inital contacts
app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

//api route to get the info
app.get('/info', (request, response) => {
    response.send(`The phonebook as currently ${notes.length} people <br> <br> ${new Date()}`)
})

//getting a single resource
app.get('/api/persons/:id', (request, response)=> {
    
    const id = Number(request.params.id);
    const contact=  contacts.find(contact => contact.id === id); 

    if(contact){
        response.json(contact)
    }
    else{
        response.status(404).end()
    }
})

//for deleting
app.delete('/api/persons/:id', (request, response)=> {
    
    const id = Number(request.params.id);
    contacts =  contacts.filter(contact => contact.id !== id); 

    response.status(204).end()
})

//posting data to the server
app.post('/api/persons', (request, response)=> {

    const body = request.body;

    //if the name or phone field is empty
    if(!body.name || !body.number) {
        return response.status(404).json({ 
            error: 'content missing' 
          })
    }
    else if(contacts.some(contact => contact.name === body.name )){
        return response.status(404).json({ 
            error: 'same name used' 
          })
    }
    

    const contact = {
        id: Math.floor((Math.random() * 1000) + 1),  //generates a random id
        name: body.name, 
        number: body.number
    } 

    contacts= contacts.concat(contact)

    response.json(contact)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})