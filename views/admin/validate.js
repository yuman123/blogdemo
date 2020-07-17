const Joi = require('joi');
const {User} = require('../../model/rule')
module.exports = async (req,res,next) => {
    const schema = {
        email:Joi.string().email().required().error(new Error('email不符合规则')),
        password:Joi.string().regex(/^[a-zA-Z0-9_]{3,20}$/).error(new Error('密码不符合规则')),
        name:Joi.string().alphanum().min(2).max(10).required().error(new Error('用户名不符合规则')),
        rule:Joi.string().valid('admin','user').required().error(new Error('角色不符合规则')),
        state:Joi.string().valid('0','1').error(new Error('状态不符合规则'))
    }
    try{
        await Joi.validate(req.body,schema)
    }catch(ex){
    // res.send(ex.message)
    // res.redirect(`/registry?message=${ex.message}`);
    // return;//这里要用return 不然后面的代码还会继续执行引发报错
    return next(JSON.stringify({path:'/registry',message:ex.message}))
    }
   let user = await User.findOne({email:req.body.email});
   if(user){
    return next(JSON.stringify({path:'/registry',message:"该用户已存在"}))
        // res.redirect("/registry?message=该用户已存在");
        // return;
   }else{
       let newUser = await User.create(req.body);
       req.session.username = newUser.name;
       req.app.locals.userInfo =newUser;
       res.redirect('/admin/user');
   }
}