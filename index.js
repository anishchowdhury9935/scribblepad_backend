const express  = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
const connectToMongoose = require('./db.js')
app.use(cors());

connectToMongoose()
app.use(express.json());
app.use('/api/users/auth',require('./routes/auth')); 
app.use('/api/users/notes',require('./routes/notes'));


app.listen(port,() => {
    console.log(`inotebook backend listening on port:${port}`)
})