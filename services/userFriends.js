const UserService = require('../services/user');

const getUserFriends = async (loggedUsername, username) => {
    try {

        const user = await UserService.getUserByUsername(username);

        if (!user) {
            return null; 
        }

        if ((!await areFriends(loggedUsername, username)) && (username !== loggedUsername)) {
            console.log('not forbidden')
            return { error: 'User is not authorized to access the friend list' };
        }

        const friends = user.friends;
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

        const bool = user1Friends.includes(username2);

        return bool;
    } catch (error) {
        console.error('Error checking friendship:', error);
        throw error; // Propagate the error to the caller
    }
};


const addFriendReq = async (senderUsername, receiverUsername) => {
    try {

        const recipientUser = await UserService.getUserByUsername(receiverUsername);

        if (!recipientUser) {
            throw new Error(`User with ID ${receiverUsername} not found`);
        }

        const senderUser = await UserService.getUserByUsername(senderUsername)
        if (!senderUser) {
            throw new Error(`User with username ${senderUsername} not found`);
        }

        // Check if sender and receiver are already friends
        if (await areFriends(senderUsername, receiverUsername)) {
            throw new Error(`User ${senderUsername} and ${receiverUsername} are already friends `);
        }


        // Check if there is an existing pending request
        if (recipientUser.friendRequests.includes(senderUsername)) {
            throw new Error(`already has a pending friend request`);
        }

        recipientUser.friendRequests.push(senderUsername);

        await recipientUser.save();

        return recipientUser; 
    } catch (error) {
        console.error('Error adding friend request:', error);
        throw error; 
    }
};



const acceptReq = async (senderUsername, receiverUsername) => {

    try {
        // Update list of friends for both of them:

        const recipientUser = await UserService.getUserByUsername(receiverUsername);
        if (!recipientUser) {
            throw new Error(`Recipient user with ID ${receiverUsername} not found`);
        }


        const senderUser = await UserService.getUserByUsername(senderUsername)
        if (!senderUser) {
            throw new Error(`User with username ${senderUsername} not found`);
        }

        recipientUser.friends.push(senderUsername);
        senderUser.friends.push(receiverUsername);

        // Remove the friend requests:
        recipientUser.friendRequests.pull(senderUser._id);
        recipientUser.friendRequests.pull(senderUsername);

        await Promise.all([recipientUser.save(), senderUser.save()]);

        console.log('Friend request accepted successfully');
        return { message: 'Friend request accepted successfully' };

    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error; 
    }
};


const deleteFriendReq = async (senderUsername, receiverUsername) => {

    try {
        // remove the sender from receiver's friendsReq list:

        const recipientUser = await UserService.getUserByUsername(receiverUsername);
        if (!recipientUser) {
            throw new Error(`Recipient user with ID ${receiverUsername} not found`);
        }

        // Remove the friend requests:
        recipientUser.friendRequests.pull(senderUser._id);
        recipientUser.friendRequests.pull(senderUsername);

        await Promise.all([recipientUser.save(), senderUser.save()]);

        console.log('Friend request deleted successfully');
        return { message: 'Friend request deleted successfully' };

    } catch (error) {
        console.error('Error deleteding friend request:', error);
        throw error; 
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

const getFriendRequests = async (username) => {
    try {
        // Retrieve the user document from the database based on the provided ID
        const user = await UserService.getUserByUsername(username);

        if (!user) {
            return null; // Return null if user is not found
        }

        // Access the friends field from the user document
        const friendReqs = user.friendRequests;
        // console.log("friends in service",friendReqs)


        return friendReqs;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        throw error; // Propagate the error to the controller
    }
};



module.exports = { getUserFriends, addFriendReq, acceptReq, deleteFriendReq, deleteFriend, areFriends, getFriendRequests };
