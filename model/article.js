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
      
    },
  })

  module.exports = Article