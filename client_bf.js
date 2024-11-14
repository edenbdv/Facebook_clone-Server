const dotenv = require('dotenv');
dotenv.config();
const net = require('net');
const readline = require('readline');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
const SocketSingleton = require('./SocketSingleton'); 

// Function to send data to the server
function sendData(socket, data) {
    socket.write(data);
}


// Function to receive data from the server
function receiveData(socket) {
    return new Promise((resolve, reject) => {
        socket.once('data', (data) => {
            resolve(data.toString().trim());
        });
        socket.once('error', reject);
        socket.once('close', () => reject(new Error('Connection closed by server')));
    });
}

// Function to handle communication with the server
async function checkUrl(url) {

    const socket = await SocketSingleton.getSocket();

    if (!socket) {
        console.error('Unable to connect to Bloom filter server.');
        return;
    }



    while (true) {
        // Send additional input to the server
        sendData(socket, `2 ${url}`);

        // Receive response for additional input
        const receivedData = await receiveData(socket);
        if (receivedData === '') {
            socket.end();
            throw new Error('Connection closed by server');
        }

        if (receivedData === 'INVALID_INPUT') {
            console.log('Error: Invalid input received from server.');
            continue; // Continue waiting for user input

            //continue;

            // case that the command is 1 (add to bloomfilter)
        } else if (receivedData === 'SUCCESS') {
            console.log('Added URL to blacklist.');
            return '1';

            //continue;

            //case that the command is 2 (check if the url is in the blacklist)
        } else {
            // console.log(receivedData);
            return receivedData;
        }
    }
}


        
module.exports = { checkUrl};