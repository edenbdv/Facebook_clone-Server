const UserModel = require('../models/user');
const PostModel = require('../models/post');
//const UserService = require('../services/user');


const getUserByUsername = async (username) => {
    return await UserModel.findOne({ username: username });
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

    // Update each property in the user object based on the request body
    Object.keys(updatedField).forEach(key => {
        if (key !== '_id') { // Exclude _id field from being updated
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



module.exports = { createUser, getUserByUsername, updateUser, deleteUser }