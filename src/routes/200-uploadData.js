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

const route = express.Router();

route.post(CONST.URL.UPLOAD_DATA, async (req, res, next) => {    
    console.log(req);

    try {
        const jobid = getArg("jobid", req);

        if (!req.file) throw new Error("file not found");

        const record = Jobs.instance.getJobRecord(jobid);
        record.zipfile = req.file.originalname;
        Jobs.instance.saveRecord(record);

        mkdirif(record.zipPath());
        FS.renameSync(req.file.path, record.zipPath());

        // await unpackDataset(record);
        handleResponse(res, CONST.URL.UPLOAD_DATA, { message: `file received: ${req.file.originalname}` });
    } catch (error) {
        logger.error(error.message);
        handleError(error, CONST.URL.UPLOAD_DATA, req, res);
    } finally {
        res.end();        
    }
});

export default route;