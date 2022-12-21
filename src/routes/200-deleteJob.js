import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.DELETE_JOB, multer().none());

// Remove a job record
export default makeRoute(
    CONST.URLS.DELETE_JOB,
    async req => {
        const jobid = getArg("jobid", req);
        Jobs.instance.deleteJob(jobid);    
        return { };
    },
    route
);
