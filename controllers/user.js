const UserService = require('../services/user');

const createUser = async (req, res) => {
   res.json(await UserService.createUser(req.body.username, req.body.password, req.body.displayName, req.body.profilePic));
};


const getUser = async (req, res) => {
   const user = await UserService.getUserById(req.params.id);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // add try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);
};

const updateUser = async (req, res) => {
   const userId = req.params.id;
   const updatedField = req.body;

   // Check if any fields are provided for update
   if (Object.keys(updatedField).length === 0) {
      return res.status(400).json({ errors: ['No fields provided for update'] });
   }

   try {
      const user = await UserService.updateUser(userId, updatedField);

      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
      }
      res.json(user);
   }catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ errors: ['Failed to update user'] });
  }

      // const user = await UserService.updateUser(req.params.id, req.body);
      // // const user = await UserService.updateUserN(req.params.id, req.body.username);
      // if (!user) {
      //    return res.status(404).json({ errors: ['User not found'] });
      //    // try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // }
      // res.json(user);
   };



   const deleteUser = async (req, res) => {
      const user = await UserService.deleteUser(req.params.id);
      if (!user) {
         return res.status(404).json({ errors: ['User not found'] });
         // add try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      }
      res.json(user);

   };

   module.exports = { createUser, getUser, updateUser, deleteUser }