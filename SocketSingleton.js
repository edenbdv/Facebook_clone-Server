// socketSingleton.js
const net = require('net');

class SocketSingleton {
  constructor(socket) {
    if (!SocketSingleton.instance) {
      this.socket = socket;
      SocketSingleton.instance = this;
    }
    return SocketSingleton.instance;
  }

    // Get the socket instance (connect if not already connected)
    async getSocket() {
      if (!this.socket) {
          await this.connect();
      }
      return this.socket;
  }


  // Initialize the connection if not already connected
  async connect() {
    if (this.socket) {
        console.log('Socket already connected.');
        return this.socket;
    }

    const IP_ADDRESS_BF_SERVER = process.env.IP_ADDRESS_BF_SERVER;
    const PORT_BF = process.env.PORT_BF;

    return new Promise((resolve, reject) => {
        this.socket = net.createConnection({ host: IP_ADDRESS_BF_SERVER, port: PORT_BF }, () => {
            console.log('Connected to the Bloom filter server.');
            resolve(this.socket);
        });

        this.socket.on('error', (error) => {
            console.error('Error connecting to Bloom filter server:', error.message);
            this.socket = null;
            reject(error);
        });

        this.socket.on('close', () => {
            console.log('Connection to Bloom filter server closed.');
            this.socket = null;
        });
    });
}

  // Method to initialize the singleton with a socket instance
  static initialize(socket) {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton(socket);
    }
  }
}

// Export a single instance of SocketSingleton
const instance = new SocketSingleton();
// Export the SocketSingleton class
module.exports = instance;