const express = require('express');
const app = express();
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const ejsMate = require('ejs-mate')
const path = require('path');
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))
app.engine('ejs', ejsMate)
const property = require('./router/property');
const admin = require('./router/admin')
app.use('/admin',admin)
app.use('/home',property)
app.get('/', (req,res,next)=>{
    res.render('index');
})
app.get('/contact', (req,res,next)=>{
    res.render('contact')
})
app.get('/about', (req,res,next)=>{
    res.render('about')
})
app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})