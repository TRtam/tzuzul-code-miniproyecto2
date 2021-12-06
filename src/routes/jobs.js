//
const {Router} = require("express");

//
const route = Router();

//
const auth = require("../services/auth.js");

//
const jobs = require("../services/jobs.js");

//
route.get("/", async (req, res) => {
    const result = [];

    (await jobs.getAll({})).forEach(job => result.push(job));

    res.status(200).json(result);
});

//
route.get("/:id", async (req, res) => {
    const job = await jobs.getById(req.params.id);

    if(!job) {
        return res.status(404).send("invalid id");
    }

    res.status(200).json(job);
});


//
route.post("/create", async (req, res) => {
    const cookies = req.cookies;

    if(cookies && cookies.login) {
        const token = await auth.verify(cookies.login);

        if(token && (token.userRole === "admin" || (token.userRole === "employer"))) {
            const details = {
                ...req.body, // {title, description}
                createdBy: token.userId,
                createdAt: Date.now(),
                taken: false,
                takenBy: ""
            };

            const job = await jobs.create(details);

            job.save();

            return res.status(200).json({success: true, message: "job created successfully"});
        }
    }

    return res.status(401).send("unauthorized");
});

//
route.post("/delete/:id", async (req, res) => {
    const cookies = req.cookies;

    if(cookies && cookies.login) {
        const token = await auth.verify(cookies.login);

        if(token && ((token.userRole === "admin") || (token.userRole === "employer"))) {
            const {id} = req.params;

            if(!id) {
                return res.status(400).json({success: false, message: "id can not be empty"});
            }

            const job = await jobs.getById(id);

            if(!job) {
                return res.status(400).json({success: false, message: "invalid job id"});
            }

            if((token.userRole == "admin") || (job.createdBy === token.userId)) {
                const deleted = await jobs.delete(id);

                if(deleted) {
                    return res.status(200).json({success: true, message: "job deleted successfully"});
                }
                else {
                    return res.status(500).json({success: true, message: "something went wrong"});
                }
            }
        }
    }

    return res.status(401).json({success: false, message: "unauthorized"});
});

//
module.exports = server => {
    server.use("/jobs", route);
}