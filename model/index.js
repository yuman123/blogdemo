const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true)//这句话是去除DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.这个报错
mongoose.connect('mongodb://localhost/blogdemo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(res => {
        console.log('数据库连接成功');
    })