import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.GET_JOB_RECORD, (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        const rec = Jobs.instance.getJobRecord(jobid);

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.GET_JOB_RECORD,
            record: rec
        }, null, 2));
    } catch (error) {
        handleError(error, CONST.URL.GET_JOB_RECORD, res);
    } finally {
        res.end();        
    }
});

export default route;