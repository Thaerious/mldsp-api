import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.ALL_JOBS, async req => {
    const records = Jobs.instance.allJobs();    
    return { records: records };
});
