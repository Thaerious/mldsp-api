import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.GET_JOB_RECORD, async req => {
    const jobid = getArg("jobid", req);
    const record = Jobs.instance.getJobRecord(jobid);

    return { record: record };
});
