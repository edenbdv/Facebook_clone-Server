const UserModel = require('../models/user');


const createUser = async (title, published) => {
    const article = new UserModel({ title: title });
    if (published) article.published = published;
    return await article.save(); //await because we want the object, not promise 
};



module.exports = { createUser }