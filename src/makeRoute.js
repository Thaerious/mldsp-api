import express from "express";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";

function makeRoute(url, cb = req => { }) {
    const route = express.Router();

    route.use(url, async (req, res, next) => {
        try {
            handleResponse(res, url, cb(req));
        } catch (error) {
            handleError(error, url, res);
        } finally {
            res.end();        
        }
    });

    return route;
}

export default makeRoute;