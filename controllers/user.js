const UserService = require('../services/user');

const createUser = async (req, res) => {
   res.json(await UserService.createUser(req.body.title));
};


module.exports = { createUser }