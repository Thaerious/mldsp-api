import CONST from "../constants.js";
import Jobs from "./Jobs.js";
import logger from "../setupLogger.js";

async function middleware(req, res, next) {
    const userid = req.body?.userid || req.query?.userid;
    let desc = req.body?.desc || req.query?.desc;

    if (!userid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.CREATE_JOB,
            message: "missing parameter 'userid'",
        });
    }

    try {
        const jobRecord = await Jobs.instance.addJob(userid, desc || "description n/a");

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.CREATE_JOB,
            jobid: jobRecord.jobid,
        });
    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.CREATE_JOB);
        logger.log(error);
        console.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.CREATE_JOB,
            message: error.message
        });
    }
}

export { middleware as default };