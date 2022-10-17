import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";

const route = express.Router();

route.use(CONST.URL.START_JOB, async (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        await new MLDSP().run(record);
        handleResponse(res, CONST.URL.START_JOB);
    } catch (error) {
        handleError(error, CONST.URL.START_JOB, res);
    } finally {
        res.end();        
    }
});

export default route;
