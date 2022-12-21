import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.SET_VALUE, multer().none());

// Set job record value
export default makeRoute(
    CONST.URLS.SET_VALUE,
    async req => {
        const jobid = getArg("jobid", req);
        const key = getArg("key", req);
        const value = getArg("value", req);

        const record = Jobs.instance.getJobRecord(jobid);
        record.settings[key] = value;
        Jobs.instance.saveRecord(record);

        return {};
    },
    route
);
