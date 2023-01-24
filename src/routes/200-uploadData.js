import CONST from "../constants.js";
import express from "express";
import FS from "fs";
import Jobs from "../Jobs.js";
import { mkdirif } from "@thaerious/utility";
import unpackDataset from "../unpackDataset.js";
import getArg from "../getArg.js";
import handleError from "../handleError.js";
import handleResponse from "../handleResponse.js";
import logger from "../setupLogger.js";
import multer from "multer";

const router = express.Router();

router.post(CONST.URLS.UPLOAD_DATA,
    multer({ dest: CONST.DATA_DIR.TEMP }).single('fileupload'),
    async (req, res, next) => {
    try {
        const jobid = getArg("jobid", req);
        logger.verbose(`${CONST.URLS.UPLOAD_DATA} jobid ${jobid}`);

        if (!req.file) throw new Error("file not found");

        const record = Jobs.instance.getJobRecord(jobid);
        record.zipfile = req.file.originalname;
        Jobs.instance.saveRecord(record);

        mkdirif(record.zipPath());
        FS.renameSync(req.file.path, record.zipPath());
        
        await unpackDataset(record);        
        handleResponse(res, CONST.URLS.UPLOAD_DATA, {
            message: `file received: ${req.file.originalname}`,
            jobid: jobid
        });
    } catch (error) {
        logger.error(error.message);
        handleError(error, CONST.URLS.UPLOAD_DATA, req, res);
    } finally {
        res.end();        
    }
});

export default router;