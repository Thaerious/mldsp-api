import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import { fsjson } from "@thaerious/utility";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.RETRIEVE_RESULTS, async req => {
    const jobid = getArg("jobid", req);
    const record = Jobs.instance.getJobRecord(jobid);
    const results = fsjson.load(record.resultsJSON());

    return { results: results };
});
