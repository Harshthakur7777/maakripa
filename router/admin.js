const express = require('express');
const router = express.Router();
const data = require('./../data/data')
const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');
const { rmdirSync } = require('fs');
const e = require('express');
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

router.get('/add',(req,res,next)=>{
    res.render('form')
})
router.post('/add',uploads.fields([{name:'mainimg'} ,{name:'img1'},{name:'img2'},{name:'img3'},{name:'img4'},{name:'img5'},{name:'img6'},{name:'img7'},{name:'img8'},{name:'img9'}]),(req,res,next)=>{
    console.log(data.DATA.length)
    console.log('type'+req.body.type)
    if(req.body.password==process.env.PASSWORD){
      let newobject = {};
      newobject.Name = req.body.Name;
      newobject.SRB = req.body.SRB;
      newobject.rate = req.body.rate;
      newobject.type = req.body.type;
      newobject.model = req.body.model;
      newobject.RTO = req.body.RTO;
      newobject.owner = req.body.owner;
      newobject.driven = req.body.driven;
      newobject.additional = req.body.additional;
     
      newobject.image = '/img/'+req.files.mainimg[0].filename;
      
      let arr = ['/img/'+req.files.img1[0].filename,'/img/'+req.files.img2[0].filename]
      if(req.files.img3) arr.push('/img/'+req.files.img3[0].filename)
      if(req.files.img4) arr.push('/img/'+req.files.img4[0].filename)
      if(req.files.img5) arr.push('/img/'+req.files.img5[0].filename)
      if(req.files.img6) arr.push('/img/'+req.files.img6[0].filename)
      if(req.files.img7) arr.push('/img/'+req.files.img7[0].filename)
      if(req.files.img8) arr.push('/img/'+req.files.img8[0].filename)
      if(req.files.img9) arr.push('/img/'+req.files.img9[0].filename)
      newobject.images = arr;
      newobject.index = data.DATA.length+1;
      data.DATA.push(newobject);
      res.redirect('/admin/add')
      console.log(newobject)
      console.log(data.DATA.length)
    }
    else{
        res.redirect('404')
    }

})
router.get('/deletecar',(req,res,next)=>{
    res.render('deletecarform');
})
router.post('/deletecar',(req,res,next)=>{
    console.log(process.env.PASSWORD)
    console.log(req.body.password)
    if(process.env.PASSWORD==req.body.password){
        data.DATA.splice(req.body.index-1, 1);
        for(let i=0; i<data.DATA.length; i++){
            data.DATA[i].index = i+1;
        }
        res.redirect('/admin/deletecar')
    }
    else{
        res.render('404')
    }
})
module.exports = router;