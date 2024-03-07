const mongoose = require('mongoose');
const userPostsService = require('./services/userPosts');
const UserModel = require('./models/user');
const UserService = require('./services/user');

const fs = require('fs').promises;

// Function to convert file to base64
const imageToBase64 = async (filePath) => {
    try {
        const data = await fs.readFile(filePath);
        const base64Data = Buffer.from(data).toString('base64');
        return base64Data;
    } catch (err) {
        throw err;
    }
};

// Define the users and their posts
const initializeUsers = async () => {
    const usersData = [
        {
            username: 'JohnDoe@gmail.com',
            password: 'Password1',
            displayName: 'John Doe',
            profilePic: await imageToBase64('pictures/john/jhonProfile.jpg'),
            posts: [
                { text: 'who is a good boyyy?', picture: await imageToBase64('pictures/john/dog.jpg')},
                { text: 'You must *RUN* to Shake-Shake', picture: await imageToBase64('pictures/john/hamburger.webp') },
            ]
        },
        {
            username: 'misUmbarella@gmail.com',
            password: 'Password2',
            displayName: 'Sharry Popins',
            profilePic: await imageToBase64('pictures/marry/MarryPopings.png'),
            posts: [
                { text: 'Supercalifragilisticexpialidocious' },
                { text: 'there is rain outside!!', picture: await imageToBase64('pictures/marry/umbarella.jpeg') },
            ]
        },
        {
            username: 'Davidmowie1@gmail.com',
            password: 'Password3',
            displayName: 'David Mowie',
            profilePic: await imageToBase64('pictures/david/david.jpg'),
            posts: [
                { text: 'Lets Dance', picture: await imageToBase64('pictures/david/thunder.jpg') },
            ]
        }
    ];

    return usersData;
};

// Initialize the database with users and their posts
const initializeDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database.');

        // Create users and their posts
        const users = await initializeUsers();
        for (const userData of users) {
            try {
                const existingUser = await UserModel.findOne({ username: userData.username });
                if (existingUser) {
                    console.log('No need to initialize - User already exists:', userData.username);
                    continue; // Skip creating posts if user already exists
                }

                const user = await UserService.createUser(userData.username, userData.password, userData.displayName, userData.profilePic);
                if (!user) {
                    console.log('Error creating user:', userData.username);
                    continue; // Skip creating posts if user creation failed
                }

                // Create posts for the user
                for (const post of userData.posts) {
                    await userPostsService.createPost(user.username, post.text, post.picture);
                }
            } catch (error) {
                console.log('Error creating user:', error.message);
            }
        }

        console.log('Database initialized with default users and their posts.');
    } catch (error) {
        console.log('Error initializing database:', error.message);
    }
};

module.exports = { initializeDatabase };


// const mongoose = require('mongoose');
// const userPostsService = require('./services/userPosts');
// const UserModel = require('./models/user');
// const UserService = require('./services/user');

// const fs = require('fs');

// // // Function to convert an image to base64


// // Function to convert file to base64
// const imageToBase64 = async  (filePath) => {
//     try {
//         const data = await fs.promises.readFile(filePath);
//         const base64Data = Buffer.from(data).toString('base64');
//         return base64Data;
//     } catch (err) {
//         throw err;
//     }
   
// };


// // Define the users and their posts
// const usersData = [
//     {
//         username: 'JohnDoe@gmail.com',
//         password: 'Password1',
//         displayName: 'John Doe',
//         profilePic:  await imageToBase64('pictures/john/jhonProfile.jpg'),
//         // profilePic: 'jgon.png',

//         posts: [
//             // { text: 'who is a good boyyy?', picture: 'dog.jpg'},
//             { text: 'who is a good boyyy?', picture: await imageToBase64('pictures/john/dog.jpg')},
//             // { text: 'You must *RUN* to Shake-Shake', picture: 'food' },

//             { text: 'You must *RUN* to Shake-Shake', picture: await  imageToBase64('pictures/john/hamburger.webp') },
            
//         ]
//     },

//     {
//         username: 'misUmbarella@gmail.com',
//         password: 'Password2',
//         displayName: 'Sharry Popins',
//         profilePic: 'MarryPopings.png',
//         profilePic:  await imageToBase64('pictures/marry/MarryPopings.png'),

//         posts: [
//             { text: 'Supercalifragilisticexpialidocious' },
//             { text: 'there is rain outside!!', picture: 'rain' },
//             { text: 'there is rain outside!!', picture: await  imageToBase64('pictures/marry/umbarella.jpeg') },
//         ]
//     },

//     {
//         username: 'Davidmowie1@gmail.com',
//         password: 'Password3',
//         displayName: 'David Mowie',
//         profilePic: await  imageToBase64('pictures/david/david.jpg'),
//         // profilePic: 'david',

//         posts: [
//             // { text: 'Lets Dance', picture: 'thunder' },
//             { text: 'Lets Dance', picture: await  imageToBase64('pictures/david/thunder.jpg') },

//         ]
//     }
// ];



// // Initialize the database with users and their posts
// const initializeDatabase = async () => {
//     try {
//         // Connect to the database
//         await mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('Connected to the database.');

//         // Create users and their posts
//         for (const userData of usersData) {
//             try {
//                 const existingUser = await UserModel.findOne({ username: userData.username });
//                 if (existingUser) {
//                     console.log('No need to initialize - User already exists:', userData.username);
//                     continue; // Skip creating posts if user already exists
//                 }

//                 const user = await UserService.createUser(userData.username, userData.password, userData.displayName, userData.profilePic);
//                 if (!user) {
//                     console.log('Error creating user:', userData.username);
//                     continue; // Skip creating posts if user creation failed
//                 }

//                 // Create posts for the user
//                 for (const post of userData.posts) {
//                     await userPostsService.createPost(user.username, post.text, post.picture);
//                 }
//             } catch (error) {
//                 console.log('Error creating user:', error.message);
//             }
//         }

//         console.log('Database initialized with default users and their posts.');
//     } catch (error) {
//         console.log('Error initializing database:', error.message);
//     }
// };

// module.exports = { initializeDatabase }