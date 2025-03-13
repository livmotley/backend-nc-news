const { checkExists } = require("../db/seeds/utils.js");
const { fetchAllUsers, fetchSpecificUser, removeUser } = require("../models/users.models.js");

exports.getAllUsers = (req, res, next) => {
    const { sort_by, order, limit, p } = req.query;
    fetchAllUsers(sort_by, order, limit, p)
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getSpecificUser = (req, res, next) => {
    const { username } = req.params;
    checkExists('users', 'username', username, 'User')
    .then(() => {
        return fetchSpecificUser(username)
    })
    .then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err);
    })
}

exports.deleteUser = (req, res, next) => {
    const { username } = req.params;
    checkExists('users', 'username', username, 'User')
    .then(() => {
        return removeUser(username)
    })
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err);
    })
}