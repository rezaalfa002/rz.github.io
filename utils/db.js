// const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/wpu',{
//   useNewUrlParser : true ,
//   useUnifiedTopology : true,
//   // useCreateIndex : true,
// });

const mongoose = require('mongoose')
//untuk deploy ke heroku process.env
const database = process.env.MONGO_URI || 'mongodb+srv://alfareza:alfareza123@cluster0.r2tt3.mongodb.net/wpu?retryWrites=true&w=majority'
mongoose.connect(database,{
  useNewUrlParser : true ,
  useUnifiedTopology : true,
  // useCreateIndex : true,
});



// // Menambah 1 data
// const contact1 = new Contact({
//   nama : 'Muhammad Alfareza',
//   nohp : '0812345677',
//   email : 'alfareza@gamil.com',
// })

// // //simpan ke collection
// contact1.save().then((contact) => console.log(contact))