# Facebook Clone -Server-Side

**Login Page:**
![image](https://github.com/user-attachments/assets/8dd01c14-2deb-4a70-b336-87779b76feb5)

**Sign Up Page:**
![image](https://github.com/user-attachments/assets/f0c9c4f3-20bd-4cc9-b677-a5f4d6371ed9)

**Feed Page:**
![umberlla](https://github.com/user-attachments/assets/eb33fba3-cac0-44a0-a3d3-aa0aeeb5e542)

![‏‏comment](https://github.com/user-attachments/assets/bc47bdef-1bdd-48e5-b8af-fb7acf65312f)
## Links:
client web:
https://github.com/edenbdv/Facebook_clone-Client.git

Bloom-Filter server:
https://github.com/edenbdv/BloomFilter.git

client android:
https://github.com/nogazit99/FB-android

## Overview:

Foo Bar is a mock server designed to mimic the functionalities of Facebook. It provides support for both Android and web clients, allowing developers to simulate interactions with the Facebook API without accessing the actual Facebook servers. The server is structured following the MVC (Model-View-Controller) architecture.

## Features:

- Mocks essential Facebook functionalities like user authentication, profile management, friend requests, posts, and comments.
- Supports both Android and web clients.
- Built with a modular architecture following the MVC pattern for easy maintenance and extensibility.
- Utilizes a service layer to encapsulate business logic and ensure separation of concerns.
- Easy-to-use routes for handling API requests.
- **Bloom Filter:** An additional server that prevents users from creating posts containing forbidden URLs, enhancing security by blocking access to restricted or harmful content. This functionality is applicable only when using the Bloom Filter server. By default, there is a blacklist containing three URLs: `['http://example.com', 'https://warning.com', 'http://danger.il']`. If a user attempts to post any of these URLs, the post will not be published.


## Dependencies:

- **Node.js**: JavaScript runtime environment for executing server-side code.
- **Express.js**: Minimalist web framework for Node.js used for building APIs.
- **MongoDB**: NoSQL database for storing user data and other application-related information.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Body-parser**: Middleware for parsing incoming request bodies.
- **jsonwebtoken**: JSON Web Token implementation for securing API endpoints.

## Installation:

1. Clone the repository from GitHub:
   git clone https://github.com/edenbdv/Facebook_clone-Server.git


2. Checkout to branch 'users'

   
3. Navigate into the project directory:
   cd Facebook_clone-Server

   
4. Install dependencies using npm:
   npm install

## Running the Server:

1. Before starting the server, ensure that the environment variables in config/bloom_filter_config.env are properly configured for your current environment. For instance, if you are using the BloomFilter server, make sure to update the IP_ADDRESS_BF_SERVER variable accordingly.
You can verify the connections in app.js and InintializeDB.js

2. Open MongoDB on your computer.

3. To start the server, run the following command:
 ```bash
node app.js

   ```
### Important Note:
When you run the server for the first time, a JavaScript script will set up the database with default users, their posts, and comments. After the process completes, you will see the message "Database initialized with default users and their posts." Please make sure that there are no existing collections named `users`, `posts`, or `comments`.

### Tip:
For the best experience, log in using the credentials for user **Eden** (Password: **Eden1234**), although any account will function properly.


