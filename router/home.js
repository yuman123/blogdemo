const express = require('express');
const home = express.Router();
home.get('/',(req,res) =>{
    res.send('欢迎来到首页')
})
home.get('/article',(req,res) =>{
    res.render('home/article')
})


module.exports = home