const { checkExists } = require("../db/seeds/utils.js");
const { fetchAllUsers, fetchSpecificUser } = require("../models/users.models.js");

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getSpecificUser = (req, res, next) => {
    const { username } = req.params;
    const promises = [
        checkExists('users', 'username', username, 'User'),
        fetchSpecificUser(username)
    ]
    Promise.all(promises)
    .then(([_, user]) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err);
    })
}