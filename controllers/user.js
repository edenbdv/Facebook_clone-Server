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
   const username = req.params.id; // Get username from request parameters
   const user = await UserService.getUserByUsername(username);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // add try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);
};



const updateUser = async (req, res) => {
   try {
      const username = req.params.id;
      const updatedField = req.body;


      user = await UserService.getUserByUsername(username);

      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
      }


      // Extract the token from the request headers
      const token = req.headers.authorization.split(' ')[1];

      // Verify the token using the token service
      const decodedToken = tokenService.verifyToken(token);
      const loggedUsername = decodedToken.username;

      console.log("logged on userane: ", loggedUsername);
      console.log("actual useranme: ", username);



      // Check if the user is authorized to perform the update
      if (username !== loggedUsername) {
         return res.status(403).json({ errors: ['User is not authorized to update this profile'] });
      }

      // Check if any fields are provided for update
      if (Object.keys(updatedField).length === 0) {
         return res.status(400).json({ errors: ['No fields provided for update'] });
      }

      const updatedUser  = await UserService.updateUser(username, updatedField);
      res.json(updatedUser);


   } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ errors: ['Failed to update user'] });
   }

};



const deleteUser = async (req, res) => {
   const username = req.params.id; // Get username from request parameters
   const user = await UserService.deleteUser(username);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // add try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);

};



module.exports = { createUser, getUser, updateUser, deleteUser }