import express from "express";

const router = express.Router();

router.use(
    "*/raw/",
    (req, res, next) => {
        console.log(req.headers)
        req.rawBody = '';
        req.on("data", chunk => req.rawBody += chunk);
        req.on('end', function () {
            console.log("body {");
            console.log(req.rawBody);
            console.log("}");
            next();
        });
    }
);

export default router;