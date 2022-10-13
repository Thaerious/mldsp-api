import CONST from "../constants.js";
import Jobs from "./Jobs.js";
import logger from "../setupLogger.js";

async function middleware(req, res, next) {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.GET_JOB_RECORD,
            message: "missing parameter 'jobid'",
        });
    }

    try {
        const rec = JSON.parse(Jobs.instance.getJob(jobid).toJSON());

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.GET_JOB_RECORD,
            record: rec
        });
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
}

export { middleware as default };