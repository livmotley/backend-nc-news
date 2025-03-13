const usersRouter = require("express").Router();
const { getAllUsers, getSpecificUser, deleteUser } = require("../controllers/users.controllers.js"); 

usersRouter.get("/", getAllUsers);

usersRouter
.route("/:username")
.get(getSpecificUser)
.delete(deleteUser);

module.exports = usersRouter;