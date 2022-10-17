import express from "express";
import handleError from "./handleError.js";
import handleResponse from "./handleResponse.js";

/**
 * Create a new express route object.  The response, when no exception
 * is thrown, will have the result of 'cb' appended to it.
 * @param {string/router} url Local url of endpoint.
 * @param {function} cb Data object generator.
 * @returns 
 */
function makeRoute(url, cb = async req => { }, route = express.Router()) {
    route.use(url, async (req, res, next) => {
        try {
            handleResponse(res, url, await cb(req));
        } catch (error) {
            handleError(error, url, res);
        } finally {
            console.log("finally");
            res.end();        
        }
    });

    return route;
}

export default makeRoute;