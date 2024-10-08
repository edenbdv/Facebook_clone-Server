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

  // Getter method to access the socket
  static getSocket() {
    return SocketSingleton.instance.socket;
  }

  // Method to initialize the singleton with a socket instance
  static initialize(socket) {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketSingleton(socket);
    }
  }
}

Object.freeze(SocketSingleton.instance); // Ensure the instance is immutable

// Export the SocketSingleton class
module.exports = SocketSingleton;