const mongoose = require('mongoose');
const articleSchmea = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'请填写文章标题']
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Person',
        required:[true,'请传递作者']
    },
    publishedDate:{
        type:Date,
        default:Date.now
    },
    cover:{
        type:String,
        default:null
    },
    content:{
        type:String
    }
})
let articles = mongoose.model('Article',articleSchmea);
module.exports = {
    articles
}