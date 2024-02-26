const UserModel = require('../models/user');

const getUserById = async (id) => { return await UserModel.findById(id); };


const createUser = async (username, password, displayName, profilePic) => {
    const user = new UserModel({ username, password, displayName, profilePic});
    return await user.save(); //await because we want the object, not promise 
};

const updateUserN = async (id, username) => { //update user username
    const user = await getUserById(id);
    if (!user) return null;
    user.username = username;
    await user.save();
    return user;
};

const updatePass = async (id, password) => { //update user password
    const user = await getUserById(id);
    if (!user) return null;
    user.password = password;
    await user.save();
    return user;
};

const deleteUser = async (id) => {
    const deletionResult = await UserModel.deleteOne({ _id: id });
    if (deletionResult.deletedCount === 0) return null; // No article found with the given id
    return deletionResult; // Return the deletion result
};


module.exports = { createUser, getUserById, updateUserN ,updatePass, deleteUser }