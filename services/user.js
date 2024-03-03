const UserModel = require('../models/user');

const getUserByUsername = async (username) => {
    return await UserModel.findOne({ username: username });
};

const createUser = async (username, password, displayName, profilePic) => {
    const user = new UserModel({ username, password, displayName, profilePic});
    return await user.save(); //await because we want the object, not promise 
};

const updateUser = async (username, updatedField) => { //update user username
    const user = await  getUserByUsername(username);
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
    const deletionResult = await UserModel.deleteOne({ username: username });
    if (deletionResult.deletedCount === 0) return null; // No article found with the given id
    return deletionResult; // Return the deletion result
};


module.exports = { createUser, getUserByUsername,updateUser, deleteUser }