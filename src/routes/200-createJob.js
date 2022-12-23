import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import multer from "multer";
import express from "express";

const route = express.Router();
route.use(CONST.URLS.CREATE_JOB, multer().none());

// Create a new job record
export default makeRoute(
    CONST.URLS.CREATE_JOB,
    async req => {
        const userid = getArg("userid", req);
        const desc = req.body?.description || req.query?.description;
        const jobRecord = await Jobs.instance.addJob(userid, desc || "description n/a");
        return { jobid: jobRecord.jobid };
    }
    , route
);