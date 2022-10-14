import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import logger from "../setupLogger.js";

const route = express.Router();

route.use(CONST.URL.ALL_JOBS, (req, res, next) => {
    try {
        const records = Jobs.instance.allJobs();

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.ALL_JOBS,
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
            route: CONST.URL.ALL_JOBS,
            message: error.message
        });
    }
});

export default route;