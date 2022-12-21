import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.GET_JOB_RECORD, multer().none());

// Retrieve a job record
export default makeRoute(
    CONST.URLS.GET_JOB_RECORD,
    async req => {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        return { record: record };
    },
    route
);
