const dotenv = require('dotenv');
dotenv.config();
const net = require('net');
const readline = require('readline');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config')

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


async function checkUrl(socket, url) {

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
                    //console.log(receivedData);
                    return receivedData;
                }
            }
    }



async function initializeServer(socket) {

   // Read the configuration environment from the file
   const bloomFilterSettings = process.env.BLOOM_FILTER_SETTINGS;
   const PORT_BF=process.env.PORT_BF;


   while (true) {

       // Send input to the server (setting of bf)
       sendData(socket, bloomFilterSettings);

       // Receive response from the server
       const receivedData = await receiveData(socket);
       if (receivedData === '') {
           socket.end();
           throw new Error('Connection closed by server');
        }

       if (receivedData === 'INVALID_INPUT') {
           console.log('Error: Invalid input received from server.');
           continue; // Continue waiting for user input
       }

       if (receivedData === 'SUCCESS'){

            const blacklistUrlsString = process.env.BLACKLIST_URLS;
            const blacklistUrls = blacklistUrlsString.split(',').map(url => url.trim());
            console.log(blacklistUrls);


            // Send additional input to the server (list of forbbiden url to add to bf)
            for (const url of blacklistUrls) { 
               sendData(socket, `1 ${url}`);

               const result = await receiveData(socket);
               if (result !== 'SUCCESS') {
                   console.log(`Error adding URL '${url}' to blacklist.`);
                   // Handle the error accordingly, like logging or throwing an exception!!!
               }
           }

           // All URLs added successfully, break the loop
           break;

             }
          }
        }
   


        async function connectToServer() {
            return new Promise((resolve, reject) => {
      
                    const IP_ADDRESS_BF_SERVER = process.env.IP_ADDRESS_BF_SERVER;;

                    const socket = net.createConnection({ host: IP_ADDRESS_BF_SERVER, port: PORT_BF }, async () => {
                    console.log('Connected to server!');
                    try {
                        // Initialize the server
                        await initializeServer(socket);
                        resolve(socket); // Resolve with the socket once initialized
                    } catch (error) {
                        reject(error);
                    }
                });
        
                socket.on('error', (err) => {
                    reject(new Error('Error connecting to server: ' + err.message));
                });
            });
        }
        



module.exports = {connectToServer, checkUrl};
