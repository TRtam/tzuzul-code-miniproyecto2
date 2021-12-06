//
const {Router} = require("express");

//
const route = Router();

//
const auth = require("../services/auth.js");

//
const users = require("../services/users.js");

//
route.get("/", async (req, res) => {
    const result = [];

    (await users.getAll({})).forEach(user => result.push(user));

    res.status(200).json(result);
});

//
route.get("/:id", async (req, res) => {    
    const user = await users.getById(req.params.id);

    if(!user) {
        return res.status(404).send("invalid id");
    }

    res.status(200).json(user);
});

//
route.post("/delete/:id", async (req, res) => {
    const cookies = req.cookies;

    if(cookies && cookies.login) {
        const token = await auth.verify(cookies.login);

        if(token && (token.userRole === "admin")) {
            const {id} = req.params;

            if(!id) {
                return res.status(400).json({success: false, message: "id can not be empty"});
            }

            const job = await users.getById(id);

            if(!job) {
                return res.status(400).json({success: false, message: "invalid user id"});
            }

            const deleted = await users.delete(id);

            if(deleted) {
                return res.status(200).json({success: true, message: "user deleted successfully"});
            }
            else {
                return res.status(500).json({success: true, message: "something went wrong"});
            }
        }
    }

    return res.status(401).json({success: false, message: "unauthorized"});
});

//
module.exports = server => {
    server.use("/users", route);
}