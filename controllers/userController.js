const models = require('../models');

module.exports = {
    // function for user to create username and password for user authentication
    createUser: (email, userName, password) => {
        models.User.create({
            email: email,
            user_name: userName,
            password: password
        })
        .then(data => console.log(data.dataValues))
        .catch(err => console.log(err));
    },

    // Allows user to change their password
    updatePassword: (userId, password) => {
        models.User.update({
            password: password
        }, {
            where: {
                id: userId
            }})
            // result gives back array with user id in it for some reason, look back at this later
            .then(result => console.log("User: " + userId + "'s password was successfully changed!"))
            .catch(err => console.log(err));
    },

    // Allows user to find another user by their user name
    findUser: (userId) => {
        models.User.findOne({
            where: {
                id: userId
            },
            include:[{
                model: models.Groups,
                through: ["id"]
            }]
        }).then(user => user.get({plain:true})
        ).catch(err => console.log(err));
    },

    // Allows user to see all other users, in descending order by how many groups the users are in
    searchAllUsers: () => {
        models.User.findAll({
            order: [
                ['number_of_Groups', 'DESC']
            ]
        }).then(users => console.log(users))
        .catch(err => console.log(err));
    }
};