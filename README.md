# Facebook Clone -Server-Side

client web:
https://github.com/nogazit99/FB

client android:
https://github.com/nogazit99/FB-android

Bloom-Filter server:
https://github.com/edenbdv/BloomFilter.git

the server-code for part 3 is in this repo under "users" branch

## Overview:

Foo Bar is a mock server designed to mimic the functionalities of Facebook. It provides support for both Android and web clients, allowing developers to simulate interactions with the Facebook API without accessing the actual Facebook servers. The server is structured following the MVC (Model-View-Controller) architecture.

## Features:

- Mocks essential Facebook functionalities like user authentication, profile management, friend requests, posts, and comments.
- Supports both Android and web clients.
- Built with a modular architecture following the MVC pattern for easy maintenance and extensibility.
- Utilizes a service layer to encapsulate business logic and ensure separation of concerns.
- Easy-to-use routes for handling API requests.

## Dependencies:

- **Node.js**: JavaScript runtime environment for executing server-side code.
- **Express.js**: Minimalist web framework for Node.js used for building APIs.
- **MongoDB**: NoSQL database for storing user data and other application-related information.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Body-parser**: Middleware for parsing incoming request bodies.
- **jsonwebtoken**: JSON Web Token implementation for securing API endpoints.

## Installation:

1. Clone the repository from GitHub:
   git clone [https://github.com/edenbdv/FooBar-Server]


2. Checkout to branch 'users'

   
3. Navigate into the project directory:
   cd Facebook_clone-Server

   
4. Install dependencies using npm:
   npm install

## Running the Server:

Before starting the server, ensure that the environment variables in config/bloom_filter_config.env are properly configured for your current environment. For instance, if you are using the BloomFilter server, make sure to update the IP_ADDRESS_BF_SERVER variable accordingly.

You can verify the connections in app.js and InintializeDB.js

To start the server, run the following command:

node app.js





