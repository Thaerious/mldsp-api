import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import getArg from "../getArg.js";
import makeRoute from "../makeRoute.js";

export default makeRoute(CONST.URL.CREATE_JOB, async req => {
    const userid = getArg("userid", req);
    let desc = req.body?.desc || req.query?.desc;
    const jobRecord = await Jobs.instance.addJob(userid, desc || "description n/a");
    
    return { jobid: jobRecord.jobid };
});