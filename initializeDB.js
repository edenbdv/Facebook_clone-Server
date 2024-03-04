const mongoose = require('mongoose');
const userPostsService = require('./services/userPosts');
const UserModel = require('./models/user');
const UserService = require('./services/user');



// Define the users and their posts
const usersData = [
    {
        username: 'JohnDoe@gmail.com',
        password: 'Password1',
        displayName: 'John Doe',
        profilePic: 'profile1.jpg',
        posts: [
            { text: 'who is a good boyyy?', picture: 'dog.png' },
            { text: 'You must *RUN* to Shake-Shake', picture: 'hamburger.png' },
        ]
    },

    {
        username: 'misUmbarella@gmail.com',
        password: 'Password2',
        displayName: 'Sharry Popins',
        profilePic: 'profile2.jpg',
        posts: [
            { text: 'Supercalifragilisticexpialidocious' },
            { text: 'there is rain outside!!', picture: 'umbarella.png' },

        ]
    },

    {
        username: 'Davidmowie1@gmail.com',
        password: 'Password3',
        displayName: 'David Mowie',
        profilePic: 'profile3.jpg',
        posts: [
            { text: 'Lets Dance', picture: 'thounder.png' },
        ]
    }
];



// Initialize the database with users and their posts
const initializeDatabase = async () => {
    try {
        // Connect to the database
        await mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database.');

        // Create users and their posts
        for (const userData of usersData) {
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

module.exports = { initializeDatabase }