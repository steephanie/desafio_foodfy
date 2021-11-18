const express = require("express");
const chefsController = require("../app/controllers/chefsController");
const homeController = require("../app/controllers/homeController");

const routes = express.Router();

const recipes = require("./recipes");
const admin = require("./admin");
const users = require("./users");

// HOME
routes.get("/", homeController.index);

routes.use("/recipes", recipes);
routes.use("/admin", admin);
routes.use("/users", users);

// Alias
routes.get("/accounts", (req, res) => {
  return res.redirect("/users/login");
});

routes.get("/about", (req, res) => {
  return res.render("main/home/about");
});

routes.get("/chefs", chefsController.list);

module.exports = routes;
