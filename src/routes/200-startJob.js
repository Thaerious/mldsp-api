import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import MLDSP from "../MLDSP.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.START_JOB, async req => {
    const jobid = getArg("jobid", req);
    const record = Jobs.instance.getJobRecord(jobid);
    await new MLDSP().run(record);

    return {};
});
