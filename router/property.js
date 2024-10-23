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
    let written = "";
    let isAll = false;
    let arr = data.DATA;
    let cars = [];
    if(req.body.cartype=='all' && req.body.budget==0){
        written = "All Cars"
        isAll=true;
        cars = arr;
    }
    else if(req.body.budget==0 && req.body.cartype!='all'){
        written = req.body.cartype;
        for(let car of arr){
            if(car.type==req.body.cartype)
            {
                cars.push(car)
            }
        }
    }
    else if(req.body.budget!=0 && req.body.cartype=='all'){
        if(req.body.budget==2000000){
            written = 'over ' + req.body.budget + 'Rs. Car'
        }
        else{
            written ="under " + req.body.budget +"Rs. Car"
        }
        for(let car of arr){
            if(car.rate<=req.body.budget)
            {
                cars.push(car)
            }
        }
    }
    else{
        written ='under '+ req.body.budget+"Rs. " + req.body.cartype + ' Cars'; 
        for(let car of arr){
            if(car.type==req.body.cartype && car.rate<=req.body.budget)
                {
                cars.push(car)
            }
        }   
    }
    
   
        res.render('cars',{numberWithCommas : function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },cars,isAll,written})
    
})
router.get('/review',(req,res,next)=>{
    const rev = review.array
    res.render('review',{rev} )
})
router.get('/:cars',(req,res,next)=>{
    let isAll = true;
    written = "";
    if(req.params.cars=='Allcars'){
        console.log(req.params.cars)
        let cars = data.DATA
        console.log(cars)
        written = 'All Car';
        res.render('cars',{numberWithCommas : function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },cars,isAll,written})
    }
    else{
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
            written = req.params.cars;
            res.render('cars',{numberWithCommas : function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              },cars, isAll})
        }
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