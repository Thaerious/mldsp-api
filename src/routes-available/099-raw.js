import express from "express";

const router = express.Router();

router.use(
    (req, res, next) => {
        console.log("RAW");
        req.rawBody = '';
        req.on("data", chunk => req.rawBody += chunk);
        req.on('end', function () {
            console.log(req.rawBody);
            next();
        });
    }
);

export default router;