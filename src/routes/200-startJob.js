import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";
import getArg from "../getArg.js";
import { routeFactory } from "../makeRoute.js";
import express from "express";
import multer from "multer";

const middleware = routeFactory(
    CONST.URLS.START_JOB,
    async req => {
        const jobid = getArg("jobid", req);
        const record = Jobs.instance.getJobRecord(jobid);
        new MLDSP().run(record).catch(err => {
            console.log(err.constructor.name);
            record.status = CONST.STATUS.ERROR;
            record.error = err.message;
            Jobs.instance.saveRecord(record);
        });
        return { record: record };        
    }
);

const route = express.Router();
route.use(CONST.URLS.START_JOB, multer().none());
route.use(CONST.URLS.START_JOB, middleware);

export { route as default, middleware };