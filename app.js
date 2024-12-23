
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



const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

CONNECTION_STRING = process.env.CONNECTION_STRING
PORT = process.env.PORT

// console.log("CONNECTION_STRING:",CONNECTION_STRING)
// console.log("PORT:",PORT)

// const connectBloomFilter = require('./client_bf');
// const socketSingleton = require('./SocketSingleton'); 


// Initialize the bloom filter connection and store the socket
// connectBloomFilter.connectToServer()
//   .then(socket => {

//    // Initialize the SocketSingleton with the socket instance
//     socketSingleton.initialize(socket);

//     console.log('Connected and initiliazed bloom filter server');

//   })
//   .catch(error => {
//     console.error('Error connecting to bloom filter server:', error.message);
//   });


const mongoose = require('mongoose');
mongoose.connect(CONNECTION_STRING);


// Call the initializeDatabase function
const  Init = require('./initializeDB');
Init.initializeDatabase();

app.use(express.static('public'))


const users = require('./routes/user');
app.use('/api/users', users);


const posts = require('./routes/posts');
app.use('/api/posts', posts);

const comments = require('./routes/comments');
app.use('/api', comments);


const tokens = require('./routes/token');
app.use('/api/tokens', tokens);


app.listen(PORT);


