import CONST from "../constants.js";
import express from "express";
import fileUpload from "express-fileupload";
import FS from "fs";
import Jobs from "../Jobs.js";
import Path from "path";
import { mkdirif } from "@thaerious/utility";
import unpackDataset from "../unpackDataset.js";
import logger from "../setupLogger.js";

const route = express.Router();
route.use(CONST.URL.UPLOAD_DATA, fileUpload({ createParentPath: true }));

route.post(CONST.URL.UPLOAD_DATA, (req, res, next) => {
    const jobid = req.body?.jobid || req.query?.jobid;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.UPLOAD_DATA,
            message: "missing parameter 'jobid'",
        });
    }

    if (!req.files) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.UPLOAD_DATA,
            message: "file not found"
        });
    }

    try {
        const record = Jobs.instance.getJobRecord(jobid);
        record.zipfile = req.files.fileupload.name;
        Jobs.instance.saveRecord(record);

        saveZipFile(record, req.files.fileupload);
        unpackDataset(record);
    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.UPLOAD_DATA);
        logger.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.UPLOAD_DATA,
            message: error.message
        });
    }

    res.json({
        status: CONST.STATUS.OK,
        route: CONST.URL.UPLOAD_DATA,
        message: `file received: ${req.files.fileupload.name}`
    });

    res.end();
});

function saveZipFile(record, file) {
    mkdirif(record.zipPath());
    FS.writeFileSync(record.zipPath(), file.data);
}

export default route;
