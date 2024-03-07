const UserFriendsService = require('../services/userFriends');
const tokenService = require('../services/token');

const getUserFriends = async (req, res) => {
    try {

        const userId = req.params.id;
        if (!userId) {
            return res.status(404).json({ errors: ['User ID not provided'] });
        }

        const token = req.headers.authorization.split(' ')[1];
         // Verify the token using the token service
         const loggedUsername = await tokenService.verifyToken(token);

         console.log("logged on useranme: ", loggedUsername);
         console.log("actual useranme: ", userId);
 

        const friends = await UserFriendsService.getUserFriends(loggedUsername, userId);
        
        if (!friends) {
            return res.json({ friends: [] }); // Return an empty array
        }

        if (friends.error) {
            return res.status(403).json({ error: friends.error }); // Send error separately
        }

        res.json({ friends });
    } catch (error) {
        console.error('Error fetching user friends:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const addFriendReq = async (req, res) => {
    try {

        const recieverId = req.params.id;


        const token = req.headers.authorization.split(' ')[1];
        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        console.log("logged on useranme: ", loggedUsername);
        console.log("actual useranme: ", recieverId);

        // Call the service function to add the friend request
        const result = await UserFriendsService.addFriendReq(loggedUsername, recieverId);

        res.json(result);
    } catch (error) {
        console.error('Error adding friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const acceptReq = async (req, res) => {
    try {
        const senderId = req.params.fid;
        const recieverId = req.params.id;

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        console.log("logged on useranme: ", loggedUsername);
        console.log("actual useranme: ", recieverId);

        // Check if the user is authorized to perform the update
        if (recieverId !== loggedUsername) {
            return res.status(403).json({ errors: ['User is not authorized'] });
        }

        const result = await UserFriendsService.acceptReq(senderId, recieverId);


        res.json(result);
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


};



const deleteFriend = async (req, res) => {
    try {

        const senderId = req.params.fid;
        const recieverId = req.params.id;

        // Extract the token from the request headers
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using the token service
        const loggedUsername = await tokenService.verifyToken(token);

        console.log("logged on useranme: ", loggedUsername);
        console.log("actual useranme: ", recieverId);

        // Check if the user is authorized to perform the update
        if (recieverId !== loggedUsername) {
            return res.status(403).json({ errors: ['User is not authorized'] });
        }

        const result = await UserFriendsService.deleteFriend(senderId, recieverId);

        res.json(result);
    } catch (error) {
        console.error('Error deleting friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




module.exports = { getUserFriends, addFriendReq, acceptReq, deleteFriend };