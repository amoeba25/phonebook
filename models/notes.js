const mongoose = require('mongoose')

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
    name: String, 
    phone: Number
})

phoneSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
    }
})

module.exports = mongoose.model('Phone', phoneSchema)