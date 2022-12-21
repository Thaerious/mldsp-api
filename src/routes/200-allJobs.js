import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import makeRoute from "../makeRoute.js";

// Retrieve all job records
export default makeRoute(CONST.URLS.ALL_JOBS, async req => {
    const records = Jobs.instance.allJobs();    
    return { records: records };
});
