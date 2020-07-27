const express = require('express');
const admin = express.Router();
const {User} = require('../model/rule')
const {articles} = require('../model/article')
const formidable = require('formidable')
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const { userInfo } = require('os');
admin.get('/login',(req,res) =>{
    res.render('admin/login')
})

admin.post('/login', async (req,res) =>{
    const {email,password} = req.body;
    if(email.trim().length == 0 ||password.trim().length == 0 ){
       return  res.status(400).send('<h4>邮件地址或者密码错误</h4>');
    }
    console.log(User);
    let user = await User.findOne({email});
    if(user){
        if(password == user.password){
          req.session.username = user.name;//写代吗需谨慎
          req.app.locals.userInfo = user;
          res.redirect('/admin/user')

        }else{
            res.status(400).send('<h4>密码错误</h4>')
        }
    }else{
        res.status(400).send('<h4>该用户不存在</h4>')
    }
})

admin.get('/user',async (req,res) => {

    req.app.locals.currentLink = 'user'
    //接受客户端传来的当前页参数
    let page = req.query.page || 1;
    //每一页显示的条数
    let pageSize = 2;    ;
    //查询用户数据的总数
    let count = await User.countDocuments({});
    //总页数
    let total = Math.ceil(count / pageSize);
    //页码对应的开始查询位置
    let start = (page - 1) * pageSize;


    let persons = await User.find().limit(pageSize).skip(start)
    res.render('admin/user',{
        persons,
        page:page,
        total:total
    })
})
admin.get('/userEdit', async (req,res) =>{
    req.app.locals.currentLink = 'user'//标识以便于侧边栏显示正确的
    let page = req.query.page || 1;
    let person = await User.findOne({_id:req.query._id});
    res.render('admin/userEdit',{person,page})
})
admin.post('/userEdit',async (req,res) => {
    const {password} = req.body;
    let page = req.query.page || 1;
    if(password.trim().length == 0 ){
       return  res.status(400).send('<h4>密码不能为空</h4>');
    }
     await User.updateOne({"_id":req.query._id},req.body);
     res.redirect('/admin/user?page='+page)
}
)
admin.get('/logout',(req,res) =>{
    //删除session
    req.session.destroy(function(){
        res.clearCookie("session-id");//删除cookie
        res.redirect('/admin/login')
        req.app.locals.userInfo = null;//清除用户登录信息
    })
    //
})
admin.get('/article', async (req,res) =>{
    req.app.locals.currentLink = 'article';
    //接受客户端传来的当前页参数
    let page = req.query.page || 1;
    //每一页显示的条数
    let pageSize = 2;    
   
    //页码对应的开始查询位置
    let start = (page - 1) * pageSize;

    // for(var i =0;i < len-1;i++){
        // let article = await articles.find().populate({//
        //     path: "author",
        //     module: User,
        //     match: {"name":"yuman" },
        //   }).skip(start).limit(pageSize);
          let useId = await User.find({"name":req.session.username})
          let art = await articles.find({"author":useId[0]._id});
           //查询用户数据的总数
    let count =  art.length;
    //总页数
    let total = Math.ceil(count / pageSize);
        let article = await articles.find({"author":useId[0]._id}).limit(pageSize).skip(start)
    // res.send(article)
    res.render('admin/article',{
        article,
        page:page,
        total:total
    })
})
admin.get('/article-add',(req,res) =>{
    req.app.locals.currentLink = 'article'
    res.render('admin/article-add')
})
admin.post('/article-add',async (req,res) =>{
    // 创建表单解析对象
    const form = new formidable.IncomingForm();
    //配置一下上传到服务器的哪个文件夹下
    form.uploadDir = path.join(__dirname,"../public/upload");
    //保留文件后缀
    form.keepExtensions = true;
    //解析表单
    form.parse(req, async (err,fields,files) => {
        //fields 保存普通表单类型 files 保存了和上传文件相关的数据
        // res.send(files.cover.path.split('public')[1]) 
        await articles.create({
            title:fields.title,
            author:fields.author,
            publishedDate:fields.publishedDate,
            cover:files.cover.path.split('public')[1],
            content:fields.content
        })
        res.redirect('/admin/article')
    })
})
admin.get('/delete',async (req,res) =>{

    await articles.findOneAndDelete({"_id":ObjectId(req.query._id)})
})
admin.get('/userdelete',async (req,res) =>{

    await User.findOneAndDelete({"_id":ObjectId(req.query._id)});
    res.redirect('/admin/user')
})
admin.get('/articleEdit', async (req,res) => {
    const {_id,page} = req.query;
    console.log(req.query);
    let article = await articles.findOne({'_id':ObjectId(_id)}).populate('author');
    console.log(article.publishedDate);
   date = JSON.stringify(article.publishedDate).substring(1,11)
    res.render('admin/article-edit',{
        article,
        date,
        page

    })
})
module.exports = admin