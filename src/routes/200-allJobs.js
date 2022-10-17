import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";

const route = express.Router();

route.use(CONST.URL.ALL_JOBS, (req, res, next) => {
    try {
        const records = Jobs.instance.allJobs();
        handleResponse(res, CONST.URL.ALL_JOBS, { records: records });
    } catch (error) {
        handleError(error, CONST.URL.ALL_JOBS, res);
    } finally {
        res.end();        
    }
});

export default route;