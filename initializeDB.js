const mongoose = require('mongoose');
const userPostsService = require('./services/userPosts');
const UserModel = require('./models/user');
const UserService = require('./services/user');
const commentsService = require('./services/comments');
const PostModel = require('./models/post');
const likesService = require('./services/likes');

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
        },
        {
            username: 'Eden1@gmail.com',
            password: 'Eden1234',
            displayName: 'Eden',
            profilePic: await imageToBase64('pictures/eden/eden.jpg'),
            posts: [
                { text: "Exciting news! The Golden Retrievers Meetup 2024 is happening soon!", picture: await imageToBase64('pictures/eden/golden_retriver.jpeg')}
            ]
        }
    ];

    return usersData;
};

// Initialize the database with users and their posts
const initializeDatabase = async () => {
    try {
        // Connect to the database
        // await mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Initializing database...');

        const userCount = await UserModel.countDocuments();
        if (userCount > 0) {
            console.log('Database already initialized - users exist. Initialization skipped.');
            return; // Exit the function if users already exist
        }


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

        const eden = await UserModel.findOne({ username: 'Eden1@gmail.com' });
        const david = await UserModel.findOne({ username: 'Davidmowie1@gmail.com' });
        const john = await UserModel.findOne({ username: 'JohnDoe@gmail.com' });
        const sharry = await UserModel.findOne({ username: 'misUmbarella@gmail.com' });



        if (eden && david && john) {
            eden.friends.push(david.username); 
            david.friends.push(eden.username); 
            eden.friendRequests.push(john.username);

            await eden.save();
            await david.save(); 
        }

        // comments and likes on posts: 
        const edenPosts = await PostModel.find({ createdBy: eden.username });
        if (eden && david && edenPosts.length > 0) {
            const edenFirstPost = edenPosts[0]; // on Eden's first post
                await commentsService.createComment( david.username, 'This is awesome news, Eden!', edenFirstPost._id );
                await likesService.likePost( david.username, edenFirstPost._id);
                await likesService.likePost( sharry.username, edenFirstPost._id);
            }
    

        const davidPosts = await PostModel.find({ createdBy: david.username });
        if (david && john && sharry &&  davidPosts.length > 0) {
            const davidFirstPost = davidPosts[0]; // on David's first post
            await commentsService.createComment( john.username, 'Only if you lead the way! 🎸🕺', davidFirstPost._id );
            await commentsService.createComment( sharry.username,"Let's dance, but only to 'A Spoonful of Sugar!' 🎶", davidFirstPost._id );
            await likesService.likePost( david.username, davidFirstPost._id);
            await likesService.likePost( sharry.username, davidFirstPost._id);
            await likesService.likePost( eden.username, davidFirstPost._id);
        }

        const johnPosts = await PostModel.find({ createdBy: john.username });
        if (eden && sharry && john && david &&  johnPosts.length > 1) { // on John's  2 first posts
            await commentsService.createComment( eden.username, 'which breed is it?', johnPosts[0]._id );
            await likesService.likePost( eden.username, johnPosts[0]._id);

            await commentsService.createComment( sharry.username, 'not kocher !', johnPosts[1]._id );
            await likesService.likePost( eden.username, johnPosts[0]._id);
            await likesService.likePost( david.username, johnPosts[0]._id);
        }

        const sharryPosts = await PostModel.find({ createdBy: sharry.username });
        if (eden && sharry && john &&  sharryPosts.length > 1) { // on sharry's  2 first posts
            await commentsService.createComment( eden.username, 'i can\'t say that 😠', sharryPosts[0]._id );

            await commentsService.createComment( john.username, 'You will catch a cold!', sharryPosts[1]._id );
            await commentsService.createComment( eden.username, ' Where did you get the umbrella?', sharryPosts[1]._id );
            await commentsService.createComment( sharry.username, ' Target', sharryPosts[1]._id );
            await likesService.likePost( john.username, sharryPosts[1]._id);
            await likesService.likePost( eden.username, sharryPosts[1]._id);

        }

        console.log('Database initialized with default users and their posts.');
    } catch (error) {
        console.log('Error initializing database:', error.message);
    }
};

module.exports = { initializeDatabase };
