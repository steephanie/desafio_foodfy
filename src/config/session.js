const db = require("./db");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

module.exports = session({
  store: new pgSession({
    pool: db,
  }),
  secret: "heyhey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 3600 * 1000,
  },
});
