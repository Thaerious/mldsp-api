import CONST from "../constants.js";
import Jobs from "./Jobs.js";
import logger from "../setupLogger.js";

async function middleware(req, res, next) {
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

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.LIST_JOBS,
            records: records
        });
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
}

export { middleware as default };