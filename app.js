const express = require('express');
const path = require('path')
 //引入body-parser，用来处理post请求参数
 const bodyParser = require('body-parser');//只能处理简单的表单数据，处理不了二进制数据(处理post请求，用了这个以后可以用req.body来获取post携带的参数)
 const dateFormate = require('dateformat');
const template = require('art-template');

 //导入express-session
const session = require('express-session');
const FileStore  = require('session-file-store')(session)
//引入路由模块
const home = require('./router/home');
const admin = require('./router/admin');
const registry = express.Router();

//引入数据库
require('./model/index')
require('./model/rule')
const {User} = require('./model/rule')
const app = express();
//告诉express框架模板在哪
app.set('views',path.join(__dirname,'views'));
//模板默认后缀
app.set('view engine','art');
//用什么样的模板引擎渲染.art文件
app.engine('art',require('express-art-template'));
template.defaults.imports .dateFormate = dateFormate;//向模板中导入dateFormate变量
app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({extended:false}));
 //配置session
app.use(session({
    name:'session-id',
    secret:'secret key',
    resave: false, //添加 resave 选项
    saveUninitialized:false,//用户未登录则不保留cookie
    cookie: { maxAge: 24 * 60 * 60 * 1000 },//一天
    // store: new FileStore() // 指明使用文件存储
})) //添加 saveUninitialized 选项

//开放静态文件
app.use(express.static(path.join(__dirname,'public')))
registry.get('/',(req,res) =>{
    const {message} = req.query;
    res.render('registry',{message})
})
app.use((req,res,next) => {//设置响应头
    res.header('Access-Control-Allow-Origin','*')//允许所有客户端访问
    res.header('Access-Control-Allow-Methods','get,post')//允许客户端使用什么请求方法访问
    next()
})


registry.post('/',require('./views/admin/validate'))

// app.use('/',(req,res) =>{
//     res.render('admin/login')
// })
app.use('/admin',(req,res,next) =>{//拦截·请求
    if(req.url != '/login'  && !req.session.username){
        res.redirect('/admin/login')
    }
    else{
        next()//用户是登陆状态，将请求放行
    }
})

//为路由匹配路径
app.use('/registry',registry);
app.use('/home',home);
app.use('/admin',admin);

app.use((err,req,res,next) =>{//处理错误的中间件
    const result = JSON.parse(err);
    res.redirect(`${result.path}?message=${result.message}`)
})
app.listen(80);
console.log('服务器已启动');