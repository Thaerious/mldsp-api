import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";

const route = express.Router();

route.use(CONST.URL.START_JOB, async (req, res, next) => {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.START_JOB,
            message: "missing parameter 'jobid'",
        });
    }

    const record = Jobs.instance.getJobRecord(jobid);
    await new MLDSP().run(record);

    res.json({
        status: CONST.STATUS.OK,
        route: CONST.URL.UPLOAD_DATA,
        message: `job started`
    })

    res.end();
});

export default route;
