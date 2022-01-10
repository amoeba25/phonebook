const mongoose = require('mongoose')

//argument condiyion
if (process.argv.length<3) {
    console.log('please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://mongouser:${password}@fullstackopen.3bpuw.mongodb.net/phonebook-app?retryWrites=true&w=majority`

//connecting to the database
mongoose.connect(url)

//initial schema for the db
const phoneSchema = new mongoose.Schema({
    name: String, 
    number: Number,
})

const Phone = mongoose.model('Phone', phoneSchema)


//if all arguments are given 
if(process.argv.length === 5) {

    // generating new nodes
    const phone = new Phone({
        name: process.argv[3], 
        number: process.argv[4],
    })

    phone.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

//if only password is given
if(process.argv.length === 3) {
    Phone.find({}).then(result => {
        console.log(`phonebook:`)
        result.forEach(phone => {
            console.log(`${phone.name} ${phone.number}`)
        })
        mongoose.connection.close()
   })
   

}


