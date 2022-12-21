import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import { fsjson } from "@thaerious/utility";
import makeRoute from "../makeRoute.js";
import express from "express";
import multer from "multer";

const route = express.Router();
route.use(CONST.URLS.RETRIEVE_RESULTS, multer().none());

// Retrive job results
export default makeRoute(
    CONST.URLS.RETRIEVE_RESULTS,
    async req => {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        const results = fsjson.load(record.resultsJSON());
        return { results: results };
    },
    route
);
