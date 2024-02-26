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

const updateUserN = async (req, res) => {
   const user = await UserService.updateUserN(req.params.id, req.body.username);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);
};

const updatePass = async (req, res) => {
   const user = await UserService.updatePass(req.params.id, req.body.password);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);
};


const deleteUser = async (req, res) => {
   const user = await UserService.deleteUser(req.params.id);
   if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
      // add try and catch!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   }
   res.json(user);

   };
   
module.exports = { createUser, getUser, updateUserN,updatePass , deleteUser }