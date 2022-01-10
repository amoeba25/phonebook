require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/notes')

app.use(cors()) //middleware for cors policy
app.use(express.json()) //middle ware for json data

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body')); //morgan middleware for logging 

app.use(express.static('build')) //middleware to serve static files from build folder

// let contacts = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//api route to get the inital contacts
app.get('/api/persons', (request, response) => {
  Phone.find({}).then(phone => {
    response.json(phone)
  })
})

//api route to get the info
// app.get('/info', (request, response) => {
//     response.send(`The phonebook as currently ${notes.length} people <br> <br> ${new Date()}`)
// })

//getting a single resource
app.get('/api/persons/:id', (request, response)=> {
    Phone.findbyId(request.params.id).then(note => {
      response.json(note)
    })
})

//for deleting
// app.delete('/api/persons/:id', (request, response)=> {
    
//     const id = Number(request.params.id);
//     contacts =  contacts.filter(contact => contact.id !== id); 

//     response.status(204).end()
// })

//posting data to the server
app.post('/api/persons', (request, response)=> {

    const body = request.body;

    //if the name or phone field is empty
    if(!body.name || !body.phone) {
        return response.status(404).json({ 
            error: 'content missing' 
          })
    }
    // else if(Phone.find({}).then(
    //   some(contact => contact.name === body.name )){
    //     return response.status(404).json({ 
    //         error: 'same name used' 
    //       })
    // }

      const phone = new Phone({
        name: body.name, 
        phone: body.phone
      })
    
      phone.save().then(savedPhone => {
        response.json(savedPhone)
      })
    
})


const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})