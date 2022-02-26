const mongoose = require('mongoose')

const Article = mongoose.model('Article',{
    title : {
      type : String,
      required : true,
    },
    subtitle : {
      type : String,
      required : true,
    },
    content : {
      type : String,
      required : true,
    },
    image : {
      type : String,
    },
    author : {
      type : String,
      required : true,
    },
    tanggal : {
      type : String,
      required : true,
    },
    sosmed : {
      type : String,
      required : true,
    },
  })

  module.exports = Article