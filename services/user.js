const UserModel = require('../models/user');
const PostModel = require('../models/post');
const TokenModel = require('../models/token');


const getUserByUsername = async (username) => {
    return await UserModel.findOne({ username: username });
};

const getDataUserByUsername = async (username) => {

    try {
        const user = await UserModel.findOne({ username: username });
        let userData = {
            username: user.username,
            displayName: user.displayName,
            profilePic: user.profilePic
        };
        return userData;

    } catch (error) {
        throw new Error('Error fetching user by username: ' + error.message);
    }

};

const createUser = async (username, password, displayName, profilePic) => {
    try {
        // Check if a user with the provided username already exists
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        const user = new UserModel({ username, password, displayName, profilePic });
        return await user.save(); //await because we want the object, not promise 
    } catch (error) {

        console.error('Error creating user:', error);
    }


};


const updateUser = async (username, updatedField) => { //update user username
    const user = await getUserByUsername(username);
    if (!user) return null;


    // Check if the updatedField contains the 'username' key
    if (updatedField.hasOwnProperty('username')) {

        const newUsername = updatedField.username;

        // Update references to this user in the posts and tokens collections
        await PostModel.updateMany({ createdBy: user.username }, { createdBy: newUsername });
        await TokenModel.updateMany({ username: user.username }, { username: newUsername });

         // Update friends lists of other users
         await UserModel.updateMany({ 'friends': username }, { $set: { 'friends.$': newUsername } });

        // Update friendRequests lists of other users
        await UserModel.updateMany({ 'friendRequests': username }, { $set: { 'friendRequests.$': newUsername } });

        // just after all the updates:
        user.username = newUsername


        // Save the updated user
        await user.save();
    }
    // Update each property in the user object based on the request body
    Object.keys(updatedField).forEach(key => {
        if (key !== '_id' && key !== 'username') { // Exclude _id  and username fields from being updated
            user[key] = updatedField[key];
        }
    });
    await user.save();
    return user;
};




const deleteUser = async (username) => {
    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return null;
        }

        const friendIds = user.friends;

        // For each friend in the list, Remove the user from their friend list
        for (const friendId of friendIds) {
            await UserModel.findByIdAndUpdate(friendId, { $pull: { friends: user._id } });
        }

        // Delete all posts created by the user
        await PostModel.deleteMany({ _id: { $in: user.posts } });

        // Finally, delete the user
        const deletionResult = await UserModel.deleteOne({ username });

        if (deletionResult.deletedCount === 0) {
            return null; // No user found with the given username
        }

        return deletionResult; // Return the deletion result
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


module.exports = { createUser, getUserByUsername, updateUser, deleteUser, getDataUserByUsername }