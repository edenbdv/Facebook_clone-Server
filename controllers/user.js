const UserService = require('../services/user');
const tokenService = require('../services/token');



const createUser = async (req, res) => {
   try {


      const newUser = await UserService.createUser(req.body.username, req.body.password, req.body.displayName, req.body.profilePic);
      res.json(newUser);
   } catch (error) {
      // Check if the error message is the custom message for existing username
      if (error.message === 'Username already exists') {
         // Send custom error message as response
         res.status(400).json({ error: 'Username already exists' });
      } else {
         // For other errors, send a generic error message
         res.status(500).json({ error: 'Internal Server Error' });
      }
   }
};


const getUser = async (req, res) => {
   try {
      const username = req.params.id; // Get username from request parameters

      user = await UserService.getUserByUsername(username);

      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
      }

      // Extract the token from the request headers
      const token = req.headers.authorization.split(' ')[1];

      // Verify the token using the token service
      const loggedUsername = await tokenService.verifyToken(token);

      // console.log("logged on username: ", loggedUsername);
      // console.log("actual useranme: ", username);

      const dataUser = await UserService.getDataUserByUsername(username, loggedUsername);
      //console.log(dataUser);

      if (!dataUser) {
         return res.status(404).json({ errors: ['User not found'] });
      }
      res.json(dataUser);

   } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ errors: ['Failed to fetch user'] });
   }

};


const updateUser = async (req, res) => {
   try {
      const username = req.params.id;
      const { fieldName, fieldValue } = req.body;


      user = await UserService.getUserByUsername(username);

      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
      }


      // Extract the token from the request headers
      const token = req.headers.authorization.split(' ')[1];


      // Verify the token using the token service
      const loggedUsername = await tokenService.verifyToken(token);

      // console.log("logged on userane: ", loggedUsername);
      // console.log("actual useranme: ", username);

      // Check if the user is authorized to perform the update
      if (username !== loggedUsername) {
         return res.status(403).json({ errors: ['User is not authorized to update this profile'] });
      }

      // Check if fieldName is provided
      if (!fieldName || !fieldValue) {
         return res.status(400).json({ errors: ['No field name/value provided for update'] });
      }

      const updatedUser = await UserService.updateUser(username, fieldName, fieldValue);
      res.json(updatedUser);


   } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ errors: ['Failed to update user'] });
   }

};


const deleteUser = async (req, res) => {
   try {
      const username = req.params.id; // Get username from request parameters

      // Extract the token from the request headers
      const token = req.headers.authorization.split(' ')[1];

      // Verify the token using the token service
      const loggedUsername = tokenService.verifyToken(token);

      // console.log("logged on username: ", loggedUsername);
      // console.log("actual username: ", username);



      // Check if the user is authorized to delete the profile
      if (username !== loggedUsername) {
         return res.status(403).json({ errors: ['User is not authorized to delete this profile'] });
      }

      const user = await UserService.deleteUser(username);
      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
      }
      res.json(user);
   } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ errors: ['Failed to delete user'] });
   }
};




module.exports = { createUser, getUser, updateUser, deleteUser }