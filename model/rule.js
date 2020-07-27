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
        unique:true,//��֤�����ַ���ظ�
    },
    rule:{
        type:String,
        required:true
    },
    state:{
        type:String,
        default:0//Ĭ������
    }
},{versionKey: false}//ȥ��_v�ֶ�
)
let User = mongoose.model('Person', personSchema, "person") //��һ��������ʾ���ӵĸ���Users��������������ʾǿ��ָ��person��
module.exports = {
    User
}