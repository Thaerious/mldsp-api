import CONST from "../constants.js";
import express from "express";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";

const route = express.Router();

route.use(CONST.URL.LIST_JOBS, (req, res, next) => {
    try {
        const userid = getArg("userid", req);
        const records = Jobs.instance.listJobs(userid);

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.LIST_JOBS,
            records: records
        }, null, 2));
    } catch (error) {
        handleError(error, CONST.URL.LIST_JOBS, res);
    } finally {
        res.end();        
    }
});

export default route;