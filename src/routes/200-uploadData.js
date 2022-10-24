import CONST from "../constants.js";
import express from "express";
import fileUpload from "express-fileupload";
import FS from "fs";
import Jobs from "../Jobs.js";
import { mkdirif } from "@thaerious/utility";
import unpackDataset from "../unpackDataset.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";
import logger from "../setupLogger.js";

const route = express.Router();
route.use(CONST.URL.UPLOAD_DATA, fileUpload({ createParentPath: true }));

route.post(CONST.URL.UPLOAD_DATA, async (req, res, next) => {    
    try {
        const jobid = getArg("jobid", req);

        if (!req.files) throw new Error("file not found");

        const record = Jobs.instance.getJobRecord(jobid);
        record.zipfile = req.files.fileupload.name;
        Jobs.instance.saveRecord(record);

        saveZipFile(record, req.files.fileupload);
        await unpackDataset(record);
        handleResponse(res, CONST.URL.UPLOAD_DATA, { message: `file received: ${req.files.fileupload.name}` });
    } catch (error) {
        logger.error(error.message);
        handleError(error, CONST.URL.UPLOAD_DATA, res);
    } finally {
        res.end();        
    }
});

function saveZipFile(record, file) {
    mkdirif(record.zipPath());
    FS.writeFileSync(record.zipPath(), file.data);
}

export default route;