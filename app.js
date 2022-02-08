const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session') //npm
const cookieParser = require('cookie-parser') //npm
const flash = require('connect-flash'); //npm
const { cookie } = require('express/lib/response');

const { body, validationResult, check } = require('express-validator');//npm express validator
const methodOverride = require('method-override')


require('./utils/db')
const Contact = require('./model/contact')
const Article = require('./model/article')

const app = express()
//untuk deploy ke heroku process.env
const port = process.env.PORT || 8000

// setup methodoverride
app.use(methodOverride('_method'))

// setup ejs
app.set('view engine','ejs')
//third-party middleware dari express
app.use(expressLayouts)
// //build-in middleware
app.use(express.static('public')) //membuat foler public jadi global
app.use(express.urlencoded({extended:true}))

// komfigurasi flash, menggunakan middleware menjalankan npm
app.use(cookieParser('secret'))
app.use(session({
  cookie : { maxAge: 6000},
  secret : 'secret',
  resave : true,
  saveUninitialized : true,
}))
app.use(flash())

//fungsi routing/midleware untuk halaman home
app.get('/', (req, res) => {
    const mahasiswa = [
      {
        nama : 'sandika galih',
        email : 'sandikagalih@gmail.com',
      },
      {
        nama : 'dika galih',
        email : 'dikagalih@gmail.com',
      },
      {
        nama : 'sapti galih',
        email : 'saptigalih@gmail.com',
      },
    ]
    
  res.render('index',{
    nama : '',
    title : 'halaman home',
    mahasiswa,
    layout : 'layouts/main-layout'
    })
  })

  app.get('/about', (req, res) => {
  
    res.render('about',{
      layout: 'layouts/main-layout',
      title :  ' Halaman About',
    })
  })


  app.get('/article', async (req, res) => {
    const articles = await Article.find()
    res.render('article',{
      layout: 'layouts/main-layout',
      title :  ' Halaman Article',
      articles : articles,
      msg : req.flash('msg'),
    })
  })

  app.get('/article/add', (req, res) => {
    res.render('add-article', {
      title : 'Lampiran Tambah Article',
      layout : 'layouts/main-layout',
    })
  })
  
  // proses input/tambah data contact
  app.post('/article', [
    body('title').custom(async(value)=>{
      const duplikat = await Article.findOne({title :  value})
      if(duplikat){
        throw new Error('Judul Artikel sudah digunakan')
      }
      return true
    }),
    // check('subtitle','Email tidak valid !').isEmail(),
    // check('nohp','nohp tidak valid !').isMobilePhone('id-ID'),
  ], (req,res)=>{
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.render('add-article', {
        title : 'Lampiran Tambah Artikel',
        layout : 'layouts/main-layout',
        errors : errors.array(), //buat manggil alert error add-contact
      })
    } else{
        Article.insertMany(req.body,(error,result)=>{
        // kirimkan flash msg
        req.flash('msg','Artikel Berhasil ditambahkan..')
        res.redirect('/article')
        })
    }
  })
  
  app.delete('/article',(req,res) =>{ // dengan methodoveride
    Article.deleteOne({title : req.body.title}).then((result)=> {
             req.flash('msg','Artikel Berhasil dihapus..')
             res.redirect('/article')
    })
  })
  
  
  // form ubah data contact sama kayak add-contact
  app.get('/article/edit/:title', async (req, res) => {
    const article = await Article.findOne({title : req.params.title})
  
    res.render('edit-article', {
      title : 'Lampiran Ubah Artikel',
      layout : 'layouts/main-layout',
      article,
    })
  })
  
  // proses ubah data contact
  app.put('/article', [
    body('title').custom(async(value,{req})=>{
      const duplikat = await Article.findOne({title : value})
      if(value !== req.body.oldTitle && duplikat){
        throw new Error('Judul sudah digunakan')
      }
      return true
    }),
    // check('subtitle','Email tidak valid !').isEmail(),
    // check('nohp','nohp tidak valid !').isMobilePhone('id-ID'),
  ], (req,res)=>{
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.render('edit-article', {
        title : 'Lampiran Ubah Artikel',
        layout : 'layouts/main-layout',
        errors : errors.array(), //buat manggil alert error add-contact
        article : req.body, //hati2 jika res.body maka ga akan muncul
      })
    } else{
         Article.updateOne(
          {_id : req.body._id},
          {
            $set : {
              title : req.body.title,
              subtitle : req.body.subtitle,
              content : req.body.content,
            },
          }
        ).then((result) =>{
        //kirimkan flash msg
        req.flash('msg','Article Berhasil diubah..')
        res.redirect('/article')
        })
    }
  })
  
    //contact dengan params / halaman detail contact
  app.get('/article/:title', async (req, res) => {
    // const contact = findContact(req.params.nama) pakai findOne MongoDB
    const article = await Article.findOne({ title : req.params.title})
    res.render('detail-article',{
      layout: 'layouts/main-layout',
      title :  ' Halaman Detail Artikel',
      article : article,
    })
  })


  app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact',{
      layout: 'layouts/main-layout',
      title :  ' Halaman Contact',
      contacts : contacts,
      msg : req.flash('msg'),
    })
  })

  // halaman form tambah data contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title : 'Form Tambah Data Contact',
    layout : 'layouts/main-layout',
  })
})

// proses input/tambah data contact
app.post('/contact', [
  body('nama').custom(async(value)=>{
    const duplikat = await Contact.findOne({nama :  value})
    if(duplikat){
      throw new Error('Nama contact sudah digunakan')
    }
    return true
  }),
  check('email','Email tidak valid !').isEmail(),
  check('nohp','nohp tidak valid !').isMobilePhone('id-ID'),
], (req,res)=>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('add-contact', {
      title : 'Form Tambah Data Contact',
      layout : 'layouts/main-layout',
      errors : errors.array(), //buat manggil alert error add-contact
    })
  } else{
      Contact.insertMany(req.body,(error,result)=>{
      // kirimkan flash msg
      req.flash('msg','Data Contact Berhasil ditambahkan..')
      res.redirect('/contact')
      })
  }
})

app.delete('/contact',(req,res) =>{ // dengan methodoveride
  Contact.deleteOne({nama : req.body.nama}).then((result)=> {
           req.flash('msg','Data Contact Berhasil dihapus..')
           res.redirect('/contact')
  })
})

// form ubah data contact sama kayak add-contact
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama : req.params.nama})

  res.render('edit-contact', {
    title : 'Form Ubah Data Contact',
    layout : 'layouts/main-layout',
    contact,
  })
})

// proses ubah data contact
app.put('/contact', [
  body('nama').custom(async(value,{req})=>{
    const duplikat = await Contact.findOne({nama : value})
    if(value !== req.body.oldNama && duplikat){
      throw new Error('nama contact sudah digunakan')
    }
    return true
  }),
  check('email','Email tidak valid !').isEmail(),
  check('nohp','nohp tidak valid !').isMobilePhone('id-ID'),
], (req,res)=>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      title : 'Form Ubah Data Contact',
      layout : 'layouts/main-layout',
      errors : errors.array(), //buat manggil alert error add-contact
      contact : req.body, //hati2 jika res.body maka ga akan muncul
    })
  } else{
       Contact.updateOne(
        {_id : req.body._id},
        {
          $set : {
            nama : req.body.nama,
            email : req.body.email,
            nohp : req.body.nohp,
          },
        }
      ).then((result) =>{
      //kirimkan flash msg
      req.flash('msg','Data Contact Berhasil diubah..')
      res.redirect('/contact')
      })
  }
})

  //contact dengan params / halaman detail contact
app.get('/contact/:nama', async (req, res) => {
  // const contact = findContact(req.params.nama) pakai findOne MongoDB
  const contact = await Contact.findOne({ nama : req.params.nama})
  res.render('detail-contact',{
    layout: 'layouts/main-layout',
    title :  ' Halaman Detail Contact',
    contact : contact,
  })
})



app.listen(port,() =>{
    console.log(`contact app with MongoDB | listening  at http://localhost:${port}`)
})