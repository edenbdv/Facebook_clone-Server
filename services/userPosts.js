const PostModel = require('../models/post');
const UserModel = require('../models/user');
const UserService = require('../services/user');
const UserFriendService = require('../services/userFriends');
const connectBloomFilter = require('../client_bf');
const SocketSingleton = require('../SocketSingleton');



// Function to extract URLs from post text using a regular expression
const extractUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || []; 
};



const checkUrlsInBlacklist = async (urls) => {
    for (const url of urls) {
        

        const isInBlacklist = await connectBloomFilter.checkUrl(url);

        if (isInBlacklist === "true true") {
            throw new Error(`forbidden url was found. `);

        } else {
            // Do something if the URL is not in the blacklist
            console.log(`isInBlacklist: `, isInBlacklist);
            console.log(`URL '${url}' is not in the blacklist.`);
        }
    }
};



const createPost = async (creatorUsername, text, picture) => {
    try {

         // Fetch the user by username to get their ID
         const creatorUser = await UserService.getUserByUsername(creatorUsername);
         const creatorId = creatorUser._id;
         if (!creatorUser) {
             throw new Error(`User with username ${creatorUsername} not found`);
         }

         // Extract URLs from the post text
         const urls = extractUrls(text);
         await checkUrlsInBlacklist(urls)
          



        // const post = new PostModel({ text: text, picture: picture, createdBy: creatorId, comments: [] });
        const post = new PostModel({ text: text, picture: picture, createdBy: creatorUsername, comments: [] });
        const savedPost = await post.save();

        // Update the user's posts list with the newly created post ID
        await UserModel.findByIdAndUpdate(creatorId, { $push: { posts: savedPost._id } });


        //console.log('Post created:', savedPost);
        return savedPost;
    } catch (error) {

        console.log('Error creating post:', error);

        throw error; // Rethrow the error to be handled by the controller
    }
};


const getUserPosts = async (loggedUsername, username) => {

    try {
        const user = await UserService.getUserByUsername(username);
        
        if (!user) {
            return null; // Return null if user is not found
        }

        if ((!await UserFriendService.areFriends(loggedUsername,username)) && (username !== loggedUsername)) {
            console.log('not forbidden')
            return { error: 'User is not authorized to access the friend list' };
        }
    
        const postsUserId = user.posts;
    
        //sort posts by creation date (new to old)
        const postsUser = await PostModel.find({ _id: { $in: postsUserId } }).sort({ createdAt: -1 });
    
    
        return postsUser; // Retrieve all user's posts from the database



    } catch {
        console.error('Error fetching user posts:', error);
        throw error; // Propagate the error to the controller
    }

   
};


const updatePost = async (postId,  fieldName, fieldValue) => {


    if (fieldName == 'text') {
    const urls = extractUrls(fieldValue);
    await checkUrlsInBlacklist(urls);
    }

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId, { [fieldName]: fieldValue }, { new: true });

         // Check if the createdAt field has not changed
         if (updatedPost && updatedPost.createdAt) {
            return updatedPost; // Return the updated post
        } else {
            console.log('Error: createdAt field is missing or null');
        }


        return updatedPost; // Return the updated post
    } catch (error) {
        console.error("Error updating post:", error);
        throw new Error('Failed to update post');
    }
};


const deletePost = async (username, postId) => {
    try {
    
        if (!username || !postId) {
            throw new Error(`Username or post ID not provided`);
        }

         // Find the post to be deleted
         const deletedPost = await PostModel.findById(postId);

        // Remove post from Post collection
        await PostModel.findByIdAndDelete(postId);

        // Remove post ID from the list of posts of the user who created it
        await UserModel.updateOne({ username: username }, { $pull: { posts: postId } });

        return deletedPost ;


    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Internal Server Error');
    }
};

const getPostById = async (postId) => {
    try {
        const post = await PostModel.findById(postId);
        return post;
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        throw error;
    }
};


module.exports = { createPost, getUserPosts, updatePost ,deletePost, getPostById };