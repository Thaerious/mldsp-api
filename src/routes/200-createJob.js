import express from "express";
import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.CREATE_JOB, async (req, res, next) => {
    try {
        const userid = getArg("userid", req);
        let desc = req.body?.desc || req.query?.desc;
        const jobRecord = await Jobs.instance.addJob(userid, desc || "description n/a");

        res.json({
            status: CONST.STATUS.OK,
            route: CONST.URL.CREATE_JOB,
            jobid: jobRecord.jobid,
        });
    } catch (error) {
        handleError(error, CONST.URL.CREATE_JOB, res);
    } finally {
        res.end();        
    }
});

export default route;