const express  = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
// const port = 5000
const connectToMongoose = require('./db.js')
const allowedOrigins = ['https://scribblepad-9935.vercel.app'];
const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

connectToMongoose()
app.use(express.json());
app.use('/api/users/auth',require('./routes/auth')); 
app.use('/api/users/notes',require('./routes/notes'));
app.get("/",(req, res) =>{
    res.send('server is running')
})


app.listen(port,() => {
    console.log(`inotebook backend listening on port:${port}`)
})
