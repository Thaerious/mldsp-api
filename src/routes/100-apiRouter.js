import Express from "express";
import FS from "fs";
import bodyParser from "body-parser";
import CONST from "../constants.js";
import createJob from "../api/createJob.js";
import getJobRecord from "../api/getJobRecord.js";
import listJobs from "../api/listJobs.js";
import deleteJob from "../api/deleteJob.js";

const apiRouter = Express.Router();

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: false }));
apiRouter.use(CONST.URL.CREATE_JOB, createJob);
apiRouter.use(CONST.URL.GET_JOB_RECORD, getJobRecord);
apiRouter.use(CONST.URL.LIST_JOBS, listJobs);
apiRouter.use(CONST.URL.DELETE_JOB, deleteJob);

// apiRouter.use(config.loc.UPLOAD_DATASET, fileUpload({
//     limits: { fileSize: config.api.MAX_FILE_SIZE },
// }));

// apiRouter.use(config.loc.UPLOAD_DATASET, async function removeResult(req, res, next) {
//     try {
//         await addDataset(req.oidc.user.email, req.files.file.name, req.files.file.data);
//         res.write(JSON.stringify({
//             "state": "success",
//             "message": "dataset uploaded successfully"
//         }));        
//     } catch (error) {
//         res.write(JSON.stringify({
//             "state": "error",
//             "message": error.message
//         }));
//     }
//     res.end();
// });

export default apiRouter;