import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.DELETE_JOB, async req => {
    const jobid = getArg("jobid", req);
    Jobs.instance.deleteJob(jobid);    

    return { };
});
