import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import { fsjson } from "@thaerious/utility";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";

const route = express.Router();

route.use(CONST.URL.RETRIEVE_RESULTS, (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        const results = fsjson.load(record.resultsJSON());
        handleResponse(res, CONST.URL.RETRIEVE_RESULTS, {results: results});
    } catch (error) {
        handleError(error, CONST.URL.RETRIEVE_RESULTS, res);
    } finally {
        res.end();        
    }
});

export default route;