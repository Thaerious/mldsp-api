import express from "express";

const router = express.Router();

router.post(
    "/raw",
    (req, res, next) => {
        console.log(req.rawHeaders);
        req.rawBody = '';
        req.on("data", chunk => req.rawBody += chunk);
        req.on('end', function () {
            console.log(req.rawBody);
            console.log(req.rawBody.length + " bytes read");
            next();
        });
    }
);

function logHeaders(req, res, next) {
    console.log("Headers");
    console.log(req.rawHeaders);
    next();
}

function handleResponse(req, res, obj = {}) {
    res.set('Content-Type', 'application/json');

    const msg = JSON.stringify({
        status: 'ok',
        route: req.method,
        ...obj
    }, null, 2);

    res.write(msg);
    res.end();
}

export default router;