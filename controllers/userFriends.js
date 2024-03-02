const UserFriendsService = require('../services/userFriends');

const getUserFriends = async (req, res) => {
    try {

        const userId = req.params.id;
        if (!userId) {
            return res.status(404).json({ errors: ['User ID not provided'] });
        }

        const friends = await UserFriendsService.getUserFriends(userId);
        if (!friends) {
            return res.json({ friends: [] }); // Return an empty array
        }

        res.json({ friends });
    } catch (error) {
        console.error('Error fetching user friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const addFriendReq = async (req, res) => { 
    try {

        const senderId = req.body.senderId;
        const recieverId = req.params.id;
        // Call the service function to add the friend request
        const result = await UserFriendsService.addFriendReq(senderId, recieverId);

        res.json(result);
    } catch (error) {
        console.error('Error adding friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const acceptReq = async (req, res) => {
    try {
       const senderId  = req.params.fid;
        const recieverId = req.params.id;

        const result = await UserFriendsService.acceptReq(senderId, recieverId);
        res.json(result);
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


};



const deleteFriend = async (req, res) => {
    try {

        const senderId  = req.params.fid;
        const receiverId = req.params.id;

        const result = await UserFriendsService.deleteFriend(senderId,receiverId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

    
    

module.exports = { getUserFriends, addFriendReq, acceptReq, deleteFriend };
