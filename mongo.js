const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const password = process.argv[2]
  
  const url =
    `mongodb+srv://fullstackopen:${password}@cluster0.keq2uwf.mongodb.net/noteApp?retryWrites=true&w=majority`
  
  mongoose.set('strictQuery',false)
  mongoose.connect(url)
  
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length>3){
      const person = new Person({
          name: process.argv[3] ,
          number: process.argv[4]
      })
      
      person.save().then((res) => {
          console.log(`Added ${res.name} number ${res.number} to the phonebook`)
          mongoose.connection.close()
      })
  } else if(process.argv.length === 3) {
      Person.find({}).then((response) => {
        console.log('phonebook: ')
        response.map((pers) => console.log(`${pers.name} ${pers.number}`) )
        mongoose.connection.close()
      })
  }
