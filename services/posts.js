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
        console.log("friends:", friends)

        let friendPosts = [];

        // Loop through each friend to get their posts
        for (const friendUsername of friends) {
             const friend = await UserService.getUserByUsername(friendUsername)
            // const friend = await UserModel.findById(friendId); // Fetch user details by _id

            //const posts = friend.posts;
            // Fetch post objects using post IDs
            const friendPostsData = friend.posts;
            const posts = await Promise.all(friendPostsData.map(postId => userPostsService.getPostById(postId)));
            

            // Only concatenate non-empty arrays of posts
            if (posts && posts.length > 0) {
                friendPosts = friendPosts.concat(posts); // Concatenate friend's posts to the array
            }
        }

        console.log(friendPosts)

        // Sort the friendPosts array by creation date (newest to oldest)
        friendPosts.sort((a, b) => b.createdAt - a.createdAt);

        friendPosts = friendPosts.slice(0, 20); // save only the newest 20 posts

        // 5  non friends posts :

        const allUsers = await UserModel.find();

        // Filter out friends
        const nonFriendUsers = allUsers.filter(user => !friends.includes(user.username));

        console.log("non friends:", nonFriendUsers);

        let nonFriendPosts = [];

        // Loop through each non-friend to get their posts
        for (const nonFriend  of nonFriendUsers) {
          

            // Fetch post objects using post IDs
            const friendPostsData = nonFriend.posts;
            const posts = await Promise.all(friendPostsData.map(postId => userPostsService.getPostById(postId)));

            // Only concatenate non-empty arrays of posts
            if (posts && posts.length > 0) {
                nonFriendPosts = nonFriendPosts.concat(posts);
            }
        }


        // Sort the friendPosts array by creation date (newest to oldest) and svae only the newest 5 posts
        nonFriendPosts.sort((a, b) => b.createdAt - a.createdAt);

        nonFriendPosts = nonFriendPosts.slice(0, 5); 

        // Combine friend and non-friend posts, and sort them by creation date
        const combinedPosts = friendPosts.concat(nonFriendPosts);

        combinedPosts.sort((a, b) => b.createdAt - a.createdAt);

        //console.log('podts',combinedPosts)

        return combinedPosts.slice(0, 25); // Limit to 25 posts


    } catch (error) {
        console.error('Error getting posts:', error);
        throw error; // Propagate the error to the caller
    }

};


module.exports = { getPosts };