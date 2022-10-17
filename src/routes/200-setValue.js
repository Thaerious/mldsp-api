import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.SET_VALUE, async req => {
    const jobid = getArg("jobid", req);
    const key = getArg("key", req);
    const value = getArg("value", req);

    const record = Jobs.instance.getJobRecord(jobid);
    record.settings[key] = value;
    Jobs.instance.saveRecord(record);

    return {};
});
