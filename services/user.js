const UserModel = require('../models/user');
const PostModel = require('../models/post');
//const UserFriendsService = require('../services/userFriends');



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

// const getUserByUsername = async (username) => {
//     return await UserModel.findOne({ username: username });
// };

// const getUserByUsername = async (username, loggedUsername) => {
//     try {
//         // Find the user by username
//         const user = await UserModel.findOne({ username: username });

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // // Check if the requester is friends with the user
//         // friends = await  UserFriendsService.getUserFriends(username)

//          // Access the friends field from the user document
//          const friendIds = user.friends;

//          // Fetch the friend documents from the database based on the IDs stored in the friends field
//          const friends = await UserModel.find({ _id: { $in: friendIds } });

//         const isFriend = friends.some(friend => friend.username === loggedUsername);

//         let userData = {
//             username: user.username,
//             displayName: user.displayName,
//             profilePic: user.profilePic
//         };

//         // If the requester is a friend, return all details except the password
//         if (isFriend) {
//             console.log('friend');
//             userData.friends = friends;
//             // add here also posts!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//             return userData;

//         } else {
//             // If not a friend, return only basic details except the password
//             console.log('not friend')
//             return userData;        
//         }
//     } catch (error) {
//         throw new Error('Error fetching user by username: ' + error.message);
//     }
// };


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



module.exports = { createUser, getUserByUsername, updateUser, deleteUser, getDataUserByUsername }