const mongoose = require('mongoose')
const uniqueValidator= require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error)=> {
        console.log(`error connecting to the port ${error.message}`)
    })

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true, 
        minLength: 3,
        required: true
    }, 
    phone: {
        type: Number,
        minLength: 8,
        required: true
    }
})

phoneSchema.plugin(uniqueValidator);

phoneSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)