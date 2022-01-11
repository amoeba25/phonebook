require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/notes')

app.use(express.static('build')) //middleware to serve static files from build folder

app.use(cors()) //middleware for cors policy
app.use(express.json()) //middle ware for json data

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body')); //morgan middleware for logging 


//test database
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

//getting a single resource
app.get('/api/persons/:id', (request, response, next)=> {
    Phone.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      }
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error)) //error handling
})

//api route to get the info
app.get('/info', (request, response) => {
  Phone.count({}).then(phone => {
    response.send(`The phonebook as currently ${phone} people <br> <br> ${new Date()}`)
  })
    
})


//for deleting entries from the server
app.delete('/api/persons/:id', (request, response, next)=> {
    
    Phone.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => { 
      next(error)})
})

//posting data to the server
app.post('/api/persons', (request, response, next)=> {

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
      .catch(error=> next(error))
    
})

//updating the phone entry if name already exists
app.put('/api/persons/:id', (request, response,next) => {
  
  const body= request.body;

  const phone ={
    name: body.name, 
    phone: body.phone
  }

  Phone.findByIdAndUpdate(request.params.id, phone, {new: true}, {runValidators: true})
    .then(updatePhone=> {
      response.json(updatePhone)
    })
    .catch(error => next(error))


})


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

//handle the requests with unknown endpoints
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name ==='ValidationError'){
    return response.status(400).send({error: "repeated entry"})
  }

  //pass error to express middleware otherwise
  next(error)
}

//last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})