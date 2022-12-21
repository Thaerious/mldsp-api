import CONST from "../constants.js";
import Jobs from "../Jobs.js";
import makeRoute from "../makeRoute.js";
import Status from "../Status.js";
import multer from "multer";

// Retrieve the status of the server.
// Currently only returns idle or busy
export default makeRoute(CONST.URLS.STATUS, async req => {
    return {
        status: Status.instance.status
    }
});
