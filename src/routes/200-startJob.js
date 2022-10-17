import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.START_JOB, async (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        await new MLDSP().run(record);

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.UPLOAD_DATA,
            message: `job started`
        })
    } catch (error) {
        handleError(error, CONST.URL.SET_VALUE, res);
    } finally {
        res.end();        
    }
});

export default route;
