import CONST from "../constants.js";
import Jobs from "./Jobs.js";
import logger from "../setupLogger.js";
import FS from "fs";

async function middleware(req, res, next) {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.DELETE_JOB,
            message: "missing parameter 'jobid'",
        });
    }

    try {
        const record = Jobs.instance.getJob(jobid);
        FS.rmSync(record.path(), { recursive: true });

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.DELETE_JOB
        });
    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.CREATE_JOB);
        logger.log(error);
        console.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.DELETE_JOB,
            message: error.message
        });
    }
}

export { middleware as default };