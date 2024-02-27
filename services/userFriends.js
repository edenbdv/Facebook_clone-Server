const UserModel = require('../models/user');

const getUserFriends = async (userId) => {
    try {
        // Retrieve the user document from the database based on the provided ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return null; // Return null if user is not found
        }

        // Access the friends field from the user document
        const friendIds = user.friends;

        // Fetch the friend documents from the database based on the IDs stored in the friends field
        const friends = await UserModel.find({ _id: { $in: friendIds } });
        return friends;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        throw error; // Propagate the error to the controller
    }
};


const addFriendReq = async (senderId, receiverId) => {
    try {
        // Find the user document of recieverId
        const recipientUser = await UserModel.findById(receiverId);

        if (!recipientUser) {
            throw new Error(`User with ID ${receiverId} not found`);
        }

        // Add senderId to the friendRequests array
        recipientUser.friendRequests.push(senderId);

        // Save the updated user document
        await recipientUser.save();

        return recipientUser; // Return the updated user document
    } catch (error) {
        console.error('Error adding friend request:', error);
        throw error; // Propagate the error to the caller
    }
};



const acceptReq = async (senderId, receiverId) => {
    //only id can do it!!! (receiver)
    try { 
        // Update list of friends for both of them:

        // Find the user document of receiverId
        const recipientUser = await UserModel.findById(receiverId);

        if (!recipientUser) {
            throw new Error(`Recipient user with ID ${receiverId} not found`);
        }

        // Find the user document of senderId
        const senderUser = await UserModel.findById(senderId);

        if (!senderUser) {
            throw new Error(`Sender user with ID ${senderId} not found`);
        }

        recipientUser.friends.push(senderId);
        senderUser.friends.push(receiverId);

        // Remove the friend request
        recipientUser.friendRequests.pull(senderId);

        // Save the updated user documents
        await Promise.all([recipientUser.save(), senderUser.save()]);

        console.log('Friend request accepted successfully');
        return { message: 'Friend request accepted successfully' };

    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error; // Propagate the error to the caller
    }
};



module.exports = { getUserFriends, addFriendReq, acceptReq };
