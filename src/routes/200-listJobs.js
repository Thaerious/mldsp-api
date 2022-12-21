import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.LIST_JOBS, multer().none());

// List all jobs
export default makeRoute(
    CONST.URLS.LIST_JOBS,
    async req => {
        const userid = getArg("userid", req);
        const records = Jobs.instance.listJobs(userid);
        return { records: records };        
    },
    route
);