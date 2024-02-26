const express = require('express');
var app = express();

const bodyParser = require('body-parser'); //post
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // req will be in json 


const cors = require('cors');
app.use(cors());


//const customEnv = require('custom-env');
// customEnv.env(process.env.NODE_ENV, './config');
// console.log(process.env.CONNECTION_STRING)
// console.log(process.env.PORT)
CONNECTION_STRING = "mongodb://localhost:27017"
PORT = 8080

const mongoose = require('mongoose');
mongoose.connect(CONNECTION_STRING);

app.use(express.static('public'))

const posts = require('./routes/post');
app.use('/api/posts', posts);

app.listen(PORT);