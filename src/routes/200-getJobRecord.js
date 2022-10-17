import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";

const route = express.Router();

route.use(CONST.URL.GET_JOB_RECORD, (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        handleResponse(res, CONST.URL.GET_JOB_RECORD, {record: record});
    } catch (error) {
        handleError(error, CONST.URL.GET_JOB_RECORD, res);
    } finally {
        res.end();        
    }
});

export default route;