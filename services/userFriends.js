const UserService = require('../services/user');

const getUserFriends = async (loggedUsername, username) => {
    try {
        // Retrieve the user document from the database based on the provided ID
        const user = await UserService.getUserByUsername(username);

        if (!user) {
            return null; // Return null if user is not found
        }


        if ((!await areFriends(loggedUsername, username)) && (username !== loggedUsername)) {
            console.log('not forbidden')
            return { error: 'User is not authorized to access the friend list' };
        }


        // Access the friends field from the user document
        const friends = user.friends;

        // Fetch the friend documents from the database based on the IDs stored in the friends field
        // const friends = await UserModel.find({ _id: { $in: friendIds } });



        return friends;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        throw error; // Propagate the error to the controller
    }
};



const areFriends = async (username1, username2) => {
    try {
        const user1 = await UserService.getUserByUsername(username1);
        const user2 = await UserService.getUserByUsername(username2);

        const user1Friends = user1.friends;

        if (!user1Friends) {
            return false;
        }


        //   // Check if user2's ID is in user1's friends list
        //   const bool = user1Friends.includes(user2._id.toString());

        // Check if user2's username is in user1's friends list
        const bool = user1Friends.includes(username2);

        return bool;
    } catch (error) {
        console.error('Error checking friendship:', error);
        throw error; // Propagate the error to the caller
    }
};


const addFriendReq = async (senderUsername, receiverUsername) => {
    try {

        // Find the user document of recieverId
        const recipientUser = await UserService.getUserByUsername(receiverUsername);

        if (!recipientUser) {
            throw new Error(`User with ID ${receiverUsername} not found`);
        }

        // Find the user document of senderUsername
        const senderUser = await UserService.getUserByUsername(senderUsername)
        if (!senderUser) {
            throw new Error(`User with username ${senderUsername} not found`);
        }


        // Check if sender and receiver are already friends or if there's an existing request
        if (await areFriends(senderUsername, receiverUsername)) {
            throw new Error(`User ${senderUsername} and ${receiverUsername} are already friends or have a pending friend request`);
        }

        // // Check if there is an existing pending request
        // if (recipientUser.friendRequests.includes(senderUser._id)) {
        //     throw new Error(`User ${receiverUsername} already has a pending friend request from ${senderUsername}`);
        // }

        // Check if there is an existing pending request
        if (recipientUser.friendRequests.includes(senderUsername)) {
            throw new Error(`User ${receiverUsername} already has a pending friend request from ${senderUsername}`);
        }


        // // Add senderId to the friendRequests array
        // recipientUser.friendRequests.push(senderUser._id);

        //Add senderUsername to the friendRequests array
        recipientUser.friendRequests.push(senderUsername);


        // Save the updated user document
        await recipientUser.save();

        return recipientUser; // Return the updated user document
    } catch (error) {
        console.error('Error adding friend request:', error);
        throw error; // Propagate the error to the caller
    }
};



const acceptReq = async (senderUsername, receiverUsername) => {

    try {
        // Update list of friends for both of them:

        // Find the user document of recieverId
        const recipientUser = await UserService.getUserByUsername(receiverUsername);

        if (!recipientUser) {
            throw new Error(`Recipient user with ID ${receiverUsername} not found`);
        }


        // Find the user document of senderUsername
        const senderUser = await UserService.getUserByUsername(senderUsername)
        if (!senderUser) {
            throw new Error(`User with username ${senderUsername} not found`);
        }


        // recipientUser.friends.push(senderUser._id);
        // senderUser.friends.push(recipientUser._id);

        recipientUser.friends.push(senderUsername);
        senderUser.friends.push(receiverUsername);

        // Remove the friend request
        recipientUser.friendRequests.pull(senderUser._id);

        // Remove the friend request
        recipientUser.friendRequests.pull(senderUsername);

        // Save the updated user documents
        await Promise.all([recipientUser.save(), senderUser.save()]);

        console.log('Friend request accepted successfully');
        return { message: 'Friend request accepted successfully' };

    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error; // Propagate the error to the caller
    }
};


const deleteFriend = async (senderUsername, receiverUsername) => {

    //only id can do it!!! (receiver)
    try {
        // Find the user document of recieverId
        const recipientUser = await UserService.getUserByUsername(receiverUsername);

        if (!recipientUser) {
            throw new Error(`Recipient user with ID ${receiverUsername} not found`);
        }

        // Find the user document of senderUsername
        const senderUser = await UserService.getUserByUsername(senderUsername)
        if (!senderUser) {
            throw new Error(`User with username ${senderUsername} not found`);
        }

        // senderId = senderUser._id;
        // receiverId = recipientUser._id


        //     // Check if sender and receiver are friends
        //     if (recipientUser.friends.includes(senderId) && senderUser.friends.includes(receiverId)) {
        //         // If they are friends, remove each other from their friend lists
        //         recipientUser.friends.pull(senderId);
        //         senderUser.friends.pull(receiverId);

        //         // Save the updated user documents
        //         await Promise.all([recipientUser.save(), senderUser.save()]);


        //         console.log('Friendship deleted successfully');
        //         return { message: 'Friendship deleted successfully' };
        //     } else {
        //         // If they are not friends, check if sender is in receiver's friend request list
        //         if (recipientUser.friendRequests.includes(senderId)) {
        //             // If sender is in receiver's friend request list, remove sender from the list
        //             recipientUser.friendRequests.pull(senderId);
        //             await recipientUser.save();
        //             console.log('Friend request deleted successfully');
        //             return { message: 'Friend request deleted successfully' };
        //         } else {
        //             // If sender is neither friend nor in friend request list, return an error
        //             throw new Error('Sender is not a friend or in friend request list');
        //         }
        //     }
        // } catch (error) {
        //     console.error('Error deleting friend request:', error);
        //     throw error; // Propagate the error to the caller
        // }


        // Check if sender and receiver are friends
        if (recipientUser.friends.includes(senderUsername) && senderUser.friends.includes(receiverUsername)) {
            // If they are friends, remove each other from their friend lists
            recipientUser.friends.pull(senderUsername);
            senderUser.friends.pull(receiverUsername);

            // Save the updated user documents
            await Promise.all([recipientUser.save(), senderUser.save()]);


            console.log('Friendship deleted successfully');
            return { message: 'Friendship deleted successfully' };
        } else {
            // If they are not friends, check if sender is in receiver's friend request list
            if (recipientUser.friendRequests.includes(senderUsername)) {
                // If sender is in receiver's friend request list, remove sender from the list
                recipientUser.friendRequests.pull(senderUsername);
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


module.exports = { getUserFriends, addFriendReq, acceptReq, deleteFriend, areFriends };
