const express = require('express');
const router = express.Router();
const data = require('./../data/data')
const review = require('./../data/review')

require('dotenv').config()
const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');
const { rmdirSync } = require('fs');
const uploads = multer({
      storage: multer.diskStorage({
          destination: function (req, file, cb) {
              cb(null, `./public/img`);
          },
          filename: function (req, file, cb) {
              cb(null, uniqid() + path.extname(file.originalname));
          },
      }),
  });
router.get('/',(req,res,next)=>{
  res.render('index')  
})

router.post('/review/addReview',uploads.single('image') ,(req,res,next)=>{
    let newReview = {};
    newReview.index = review.array.length+1
    newReview.name = req.body.name;
    newReview.profession = req.body.profession;
    newReview.content = req.body.review;
    if(req.file){
        newReview.image = '/img/'+req.file.filename;
    }
    else{
        newReview.image = '/img/profile.png'
    }
    review.array.push(newReview);
    res.redirect('/home/review')
})
router.get('/review/addreview',(req,res,next)=>{
    res.render('reviewform')
})
router.post('/search',(req,res,next)=>{
    let isAll = false;
    let arr = data.DATA;
    let cars = [];
    if(req.body.cartype=='all'){
        isAll=true;
        cars = arr;
        res.render('cars',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },cars,isAll})
    }
    else if(req.body.budget==0){
        for(let car of arr){
            if(car.type==req.body.cartype)
            {
                cars.push(car)
            }
        }
    }
    for(let car of arr){
        if(car.type==req.body.cartype && car.rate<=req.body.budget)
            {
            cars.push(car)
        }
    }
    if(cars.length<=0){
        res.send('empty')
    }
    res.render('cars',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },cars,isAll})
})
router.get('/review',(req,res,next)=>{
    const rev = review.array
    res.render('review',{rev} )
})
router.get('/:cars',(req,res,next)=>{
    let isAll = true;
    if(req.params.cars=='Allcars'){
        let cars = data.DATA
        res.render('cars',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },cars,isAll})
    }
    let arr = data.DATA;
    let cars = [];
    for(let car of arr){
        console.log(car.type)
        const type = car.type;
        if(type==req.params.cars){
            cars.push(car)
        }
    }
    isAll=false;
    if(cars.length==0){
        res.render('404');
    }
    else{
        res.render('cars',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          },cars, isAll})
    }
})
router.get('/:cars/:id',(req,res,next)=>{
    let car;
    let arr = data.DATA;
    for(prop of arr){
        if(prop.type==req.params.cars && prop.index==req.params.id){
            car = prop;
        }
    }
    if(car){
        res.render('car-detail',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          },car})
    }
})
module.exports = router