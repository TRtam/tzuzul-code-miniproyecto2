// import express
const express = require("express");

// create server
const server = express();

// connect to database
require("./config/database.js")();

// add server middlewares
server.use(require("cookie-parser")());
server.use(express.json());

// add server routes
require("./routes/auth.js")(server);
require("./routes/users.js")(server);
require("./routes/jobs.js")(server);

// import config
const config = require("./config/index.js");

// 
server.listen(config.server.port, () => console.log(`server is listening on port ${config.server.port}`));