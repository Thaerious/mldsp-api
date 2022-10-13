import express from "express";
import CONST from "../constants.js";
import Jobs from "../api/Jobs.js";
import logger from "../setupLogger.js";

const route = express.Router();

route.post(CONST.URL.DELETE_JOB, (req, res, next) => {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.DELETE_JOB,
            message: "missing parameter 'jobid'",
        });
    }

    try {
        const record = Jobs.instance.deleteJob(jobid);

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.DELETE_JOB
        });
    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.CREATE_JOB);
        logger.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.DELETE_JOB,
            message: error.message
        });
    }
});

export default route;