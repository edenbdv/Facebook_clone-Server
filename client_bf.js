const net = require('net');
const readline = require('readline');



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
async function handleCommunication(socket) {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Read the configuration environment from the file
    const configEnv = fs.readFileSync('config.env', 'utf8');


    
    while (true) {
        // Read input from the user
        console.log("Enter bloom filter array size and hash functions: ");
        const input = await new Promise((resolve) => {
            rl.question('', (input) => resolve(input));
        });

        // Send input to the server
        sendData(socket, input);

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

                 // Ask for additional input
                rl.setPrompt('Enter command and url: ');
                rl.prompt();
                const additionalInput = await new Promise((resolve) => {
                    rl.once('line', (input) => resolve(input));
                });

                 // Send additional input to the server
                sendData(socket, additionalInput);


                // Receive response for additional input
                const receivedData = await receiveData(socket);
                if (receivedData === '') {
                    break; // Exit the loop if there's an error or the connection is closed
                }

                if (receivedData === 'INVALID_INPUT') {
                    console.log('Error: Invalid input received from server.');
                    continue;

                  // case that the command is 1 (add to bloomfilter)
                } else if (receivedData === 'SUCCESS') {
                    console.log('Added URL to blacklist.');
                    continue;

                 //case that the command is 2 (check if the url is in the blacklist)
                } else {
                    console.log(receivedData);
                }
            }
    }
    rl.close();
    socket.end(); // Close the socket connection
}
}




// Create a TCP client and connect to the server
const socket = net.createConnection({ host: '172.26.218.219', port: 5555 }, () => {
    console.log('Connected to server!');
    handleCommunication(socket).catch((err) => {
        console.error('Error:', err.message);
        socket.destroy();
        process.exit(1);
    });
});

socket.on('error', (err) => {
    console.error('Error connecting to server:', err.message);
    process.exit(1);
});


module.exports = {handleCommunication};
