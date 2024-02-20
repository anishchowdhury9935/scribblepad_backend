const mongoose = require('mongoose');
// const host_url ='mongodb://127.0.0.1:27017/inotebook';
const host_url = process.env.dbServer;

const connectToMongo = ()=>{
    mongoose.connect(host_url).then(()=>{
        console.log('connected to mongoose ✅');
    }).catch(()=>{
        console.log('error connecting to mongoose❌');
    })
}
module.exports = connectToMongo;
