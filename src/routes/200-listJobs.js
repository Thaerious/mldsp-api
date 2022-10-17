import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.LIST_JOBS, async req => {
    const userid = getArg("userid", req);
    const records = Jobs.instance.listJobs(userid);

    return { records: records };
});