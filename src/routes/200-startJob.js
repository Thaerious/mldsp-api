import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.START_JOB, multer().none());

// Start MLDSP
export default makeRoute(
    CONST.URLS.START_JOB, async req => {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        await new MLDSP().run(record);

        return {};
    },
    route
);
