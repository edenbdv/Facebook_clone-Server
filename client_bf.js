const net = require('net');
const readline = require('readline');
const fs = require('fs');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');



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
async function handleCommunication(socket, command, url) {

    // Read the configuration environment from the file
    const bloomFilterSettings = process.env.BLOOM_FILTER_SETTINGS;
    const blacklistUrlsString = process.env.BLACKLIST_URLS;
    const blacklistUrls = blacklistUrlsString.split(',').map(url => url.trim());
    console.log(blacklistUrls)

    while (true) {

        // Send input to the server
        sendData(socket, bloomFilterSettings);

        // Receive response from the server
        const receivedData = await receiveData(socket);
        if (receivedData === '') {
            break; // Exit the loop if there's an error or the connection is closed
        }

        // Check if the received data indicates an invalid input
        if (receivedData === 'INVALID_INPUT') {
            console.log('Error: Invalid input received from server.');
            continue; // Continue waiting for user input
        }

        // Check if the received data indicates a successful response
        if (receivedData === 'SUCCESS') {


            while (true) {


             // Send additional input to the server
             sendData(socket, `${command} ${url}`);


                // Receive response for additional input
                const receivedData = await receiveData(socket);
                if (receivedData === '') {
                    break; // Exit the loop if there's an error or the connection is closed
                }

                if (receivedData === 'INVALID_INPUT') {
                    console.log('Error: Invalid input received from server.');
                    return '0';

                    //continue;

                  // case that the command is 1 (add to bloomfilter)
                } else if (receivedData === 'SUCCESS') {
                    console.log('Added URL to blacklist.');
                    return '1';

                    //continue;

                 //case that the command is 2 (check if the url is in the blacklist)
                } else {
                    //console.log(receivedData);
                    return receivedData;
                }
            }
    }
    rl.close();
    socket.end(); // Close the socket connection
}
}


// Create a TCP client and connect to the server
async function connectToServer(command, url) {

   return new Promise((resolve, reject) => {

        const ip = console.log(process.env.CONNECTION_STRING)
        //const ip = '172.26.218.219';
        const socket = net.createConnection({ host: ip, port: 5555 }, async () => {
            console.log('Connected to server!');
            try {
                const isInBlacklist = await handleCommunication(socket, command, url);
                resolve(isInBlacklist);
            } catch (error) {
                reject(error);
            }
        });

        socket.on('error', (err) => {
            reject(new Error('Error connecting to server: ' + err.message));
        });
    });
}



module.exports = {connectToServer};
