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


const deleteFriend = async (senderId, receiverId) => {

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

        // Check if sender and receiver are friends
        if (recipientUser.friends.includes(senderId) && senderUser.friends.includes(receiverId)) {
            // If they are friends, remove each other from their friend lists
            recipientUser.friends.pull(senderId);
            senderUser.friends.pull(receiverId);

            // Save the updated user documents
            await Promise.all([recipientUser.save(), senderUser.save()]);


            console.log('Friendship deleted successfully');
            return { message: 'Friendship deleted successfully' };
        } else {
            // If they are not friends, check if sender is in receiver's friend request list
            if (recipientUser.friendRequests.includes(senderId)) {
                // If sender is in receiver's friend request list, remove sender from the list
                recipientUser.friendRequests.pull(senderId);
                await recipientUser.save();
                console.log('Friend request deleted successfully');
                return { message: 'Friend request deleted successfully' };
            } else {
                // If sender is neither friend nor in friend request list, return an error
                throw new Error('Sender is not a friend or in friend request list');
            }
        }
    } catch (error) {
        console.error('Error deleting friend request:', error);
        throw error; // Propagate the error to the caller
    }

}


module.exports = { getUserFriends, addFriendReq, acceptReq, deleteFriend };
