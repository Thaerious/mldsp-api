import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.SET_VALUE, (req, res, next) => {  
    try {
        const jobid = getArg("jobid", req);
        const key = getArg("key", req);
        const value = getArg("value", req);

        const record = Jobs.instance.getJobRecord(jobid);
        record.settings[key] = value;
        Jobs.instance.saveRecord(record);

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.SET_VALUE,
            record: record
        }, null, 2));
    } catch (error) {
        handleError(error, CONST.URL.SET_VALUE, res);
    } finally {
        res.end();        
    }
});

export default route;
