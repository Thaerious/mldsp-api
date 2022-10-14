import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import logger from "../setupLogger.js";

const route = express.Router();

route.post(CONST.URL.GET_JOB_RECORD, (req, res, next) => {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.GET_JOB_RECORD,
            message: "missing parameter 'jobid'",
        });
    }

    try {
        const rec = Jobs.instance.getJobRecord(jobid);
        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.GET_JOB_RECORD,
            record: rec
        }, null, 2));
        res.end();

    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.GET_JOB_RECORD);
        logger.log(error);
        console.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.GET_JOB_RECORD,
            message: error.message
        });
    }
});

export default route;