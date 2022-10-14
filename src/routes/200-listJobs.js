import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import logger from "../setupLogger.js";

const route = express.Router();

route.post(CONST.URL.LIST_JOBS, (req, res, next) => {
    const userid = req.body?.userid || req.query?.userid;

    if (!userid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.LIST_JOBS,
            message: "missing parameter 'userid'",
        });
    }

    try {
        const records = Jobs.instance.listJobs(userid);

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.LIST_JOBS,
            records: records
        }, null, 2));
        res.end();
    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.GET_JOB_RECORD);
        logger.log(error);
        console.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.LIST_JOBS,
            message: error.message
        });
    }
});

export default route;