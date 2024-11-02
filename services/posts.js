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

        let friendPosts = [];


        // Loop through each friend to get their posts
    for (const friendUsername of friends) {
        const friend = await UserService.getUserByUsername(friendUsername);
        const friendPostsData = friend.posts;


        // Fetch each post using its ID
            const posts = await Promise.all(friendPostsData.map(async postId => {
                try {
                    const post = await userPostsService.getPostById(postId);

                    return post;  
                } catch (error) {
                    console.error(`Error fetching post with ID ${postId}:`, error);
                    return null; 
                }
                    console.log(`Fetching post with ID: ${postId}`);
              
            }));

              // Filter out null posts
            const validFriendPosts = posts.filter(post => post !== null);

            // Only concatenate non-empty arrays of posts
            if (validFriendPosts && posts.length > 0) {
                friendPosts = friendPosts.concat(validFriendPosts);
            }
        }


      

        // Sort the friendPosts array by creation date (newest to oldest)
        friendPosts.sort((a, b) => b.createdAt - a.createdAt);
        friendPosts = friendPosts.slice(0, 20); // save only the newest 20 posts

        // 5  non friends posts :
        const allUsers = await UserModel.find();

        // Filter out friends
        const nonFriendUsers = allUsers.filter(user => !friends.includes(user.username));

        let nonFriendPosts = [];

      
        for (const nonFriend of nonFriendUsers) {
            const nonFriendPostsData = nonFriend.posts;

            const posts = await Promise.all(nonFriendPostsData.map(async postId => {
                try {
                    const post = await userPostsService.getPostById(postId);
                    return post;  // Return the post or null if not found
                } catch (error) {
                    console.error(`Error fetching post with ID ${postId}:`, error);
                    return null;  
                }
            }));

                // Filter out null posts
            const validNonFriendPosts = posts.filter(post => post !== null);

            if (validNonFriendPosts.length > 0) {
                nonFriendPosts = nonFriendPosts.concat(validNonFriendPosts);
            }
        }


        // Sort the friendPosts array by creation date (newest to oldest) and svae only the newest 5 posts
        nonFriendPosts.sort((a, b) => b.createdAt - a.createdAt);
    

        nonFriendPosts = nonFriendPosts.slice(0, 5); 

        // Combine friend and non-friend posts, and sort them by creation date
        const combinedPosts = friendPosts.concat(nonFriendPosts);

        combinedPosts.sort((a, b) => b.createdAt - a.createdAt);
  
        return combinedPosts.slice(0, 25); // Limit to 25 posts


    } catch (error) {
        console.error('Error getting posts:', error);
        throw error; // Propagate the error to the caller
    }

};


module.exports = { getPosts };