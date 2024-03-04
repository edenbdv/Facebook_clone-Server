const express = require('express');
var app = express();

const bodyParser = require('body-parser'); //post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // req will be in json 

// Increase the maximum request body size limit
app.use(bodyParser.json({ limit: '180mb' }));
app.use(bodyParser.urlencoded({ limit: '180mb', extended: true }));


const cors = require('cors');
app.use(cors());


// const customEnv = require('custom-env');
// customEnv.env(process.env.NODE_ENV, './config');
// console.log(process.env.CONNECTION_STRING)
// console.log(process.env.PORT)
CONNECTION_STRING = "mongodb://localhost:27017"
PORT = 12345

const mongoose = require('mongoose');
mongoose.connect(CONNECTION_STRING);



app.use(express.static('public'))


const users = require('./routes/user');
app.use('/api/users', users);


const posts = require('./routes/posts');
app.use('/api/posts', posts);

const tokens = require('./routes/token');
app.use('/api/tokens', tokens);


app.listen(PORT);