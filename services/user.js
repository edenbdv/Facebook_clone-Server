const UserModel = require('../models/user');
const PostModel = require('../models/post');
const TokenModel = require('../models/token');


const getUserByUsername = async (username) => {
    return await UserModel.findOne({ username: username });
};


const getDataUserByUsername = async (username, loggedUsername) => {
    try {
        const user = await UserModel.findOne({ username: username });
        let userData = {
            username: user.username,
            displayName: user.displayName,
            profilePic: user.profilePic
        };

        // Check if the username matches the loggedUsername
        if (username === loggedUsername) {
            // Add password and friendRequests to userData
            userData.password = user.password;
            userData.friendRequests = user.friendRequests;
        }

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




const updateUser = async (username, fieldName, fieldValue) => {

    try {
        const user = await UserModel.findOne({ username });
        if (!user) return null;

        console.log("fieldName",fieldName)
        console.log("fieldValue",fieldValue)

        // Check if the updatedField contains the 'username' key
        if (fieldName == 'username') {

            const newUsername = fieldValue;

            // Update references to this user in the posts and tokens collections
            await PostModel.updateMany({ createdBy: user.username }, { createdBy: newUsername });
            await TokenModel.updateMany({ username: user.username }, { username: newUsername });

            // Update friends lists of other users
            await UserModel.updateMany({ 'friends': username }, { $set: { 'friends.$': newUsername } });

            // Update friendRequests lists of other users
            await UserModel.updateMany({ 'friendRequests': username }, { $set: { 'friendRequests.$': newUsername } });

            // just after all the updates:
            user.username = newUsername
            await user.save();

        } else {
            // Update the specified field
            user[fieldName] = fieldValue;

            await user.save();
        }
        //console.log("updated user: ", user);
        return { success: true, message: "User updated successfully", user }; 
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Error updating user", error }; 
    }
};




const deleteUser = async (username) => {
    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return null;
        }


        const friendsNames = user.friends;
        //console.log("friends of the deleted user", friendsNames);

        // For each friend in the list, Remove the user from their friend list
        for (const friendName of friendsNames) {
            const friend = await UserModel.findOne({ username: friendName });

            if (friend && friend.friends.includes(user.username)) {
                await UserModel.findByIdAndUpdate(friend._id, { $pull: { friends: user.username } });
            } else {
                console.log(`User ${friendName} is not a friend of ${user.username}`);
            }
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