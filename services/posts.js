const userPostsService = require('../services/userPosts');
const UserService = require('../services/user');
const UserModel = require('../models/user');




const getPosts = async (username) => {

    try {
        const currentUser = await UserService.getUserByUsername(username);

        if (!currentUser) {
            throw new Error(`User with ID ${username} not found`);
        }

        const friends = currentUser.friends;
        console.log(friends)

        let friendPosts = [];

        // Loop through each friend to get their posts
        for (const friendId  of friends) {
            const friend = await UserModel.findById(friendId); // Fetch user details by _id
            friendUsername = friend.username;

            const posts = await userPostsService.getPosts(friendUsername); // Get posts of friend
            
            console.log('Posts for', friendUsername, ':', posts); // Log the posts

            // Only concatenate non-empty arrays of posts
            if (posts && posts.length > 0) {
                friendPosts = friendPosts.concat(posts); // Concatenate friend's posts to the array
            }
        }

        // Sort the friendPosts array by creation date (newest to oldest)
        friendPosts.sort((a, b) => b.createdAt - a.createdAt);

        return friendPosts.slice(0, 20); // Return the last 20 posts

    } catch (error) {
        console.error('Error getting posts:', error);
        throw error; // Propagate the error to the caller
    }

};


module.exports = { getPosts };