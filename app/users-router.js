const usersRouter = require("express").Router();
const { getAllUsers, getSpecificUser } = require("../controllers/users.controllers.js"); 

usersRouter.get("/", getAllUsers);

usersRouter.get("/:username", getSpecificUser);

module.exports = usersRouter;