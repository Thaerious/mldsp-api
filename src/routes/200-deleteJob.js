import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.DELETE_JOB, (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        Jobs.instance.deleteJob(jobid);

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.DELETE_JOB
        });
    } catch (error) {
        handleError(error, CONST.URL.DELETE_JOB, res);
    } finally {
        res.end();        
    }
});

export default route;