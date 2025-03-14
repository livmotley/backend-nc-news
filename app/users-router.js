const usersRouter = require("express").Router();
const { getAllUsers, getSpecificUser, deleteUser, patchUser } = require("../controllers/users.controllers.js"); 

usersRouter.get("/", getAllUsers);

usersRouter
.route("/:username")
.get(getSpecificUser)
.delete(deleteUser)
.patch(patchUser)

module.exports = usersRouter;