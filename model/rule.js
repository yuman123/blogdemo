const mongoose = require('mongoose');
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,//保证邮箱地址不重复
    },
    rule:{
        type:String,
        required:true
    },
    state:{
        type:String,
        default:0//默认启用
    }
},{versionKey: false}//去掉_v字段
)
let User = mongoose.model('Person', personSchema, "person") //第一个参数表示连接的复数Users，第三个参数表示强制指定person表
module.exports = {
    User
}