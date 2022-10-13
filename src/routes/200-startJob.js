import CONST from "../constants.js";
import express from "express";
import FS from "fs";
import Jobs from "../api/Jobs.js";
import Path from "path";
import { mkdirif } from "@thaerious/utility";

const uploadRoute = express.Router();

uploadRoute.post(CONST.URL.START_JOB, (req, res, next) => {
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

    const record = Jobs.instance.getJobRecord(jobid);

    saveZipFile(record, req.files.file);

    res.json({
        status: CONST.STATUS.OK,
        route: CONST.URL.UPLOAD_DATA,
        message: `file received: ${req.files.file.name}`
    })

    res.end();
});

function saveZipFile(record, file) {
    mkdirif(record.dataPath());
    const path = Path.join(record.dataPath(), file.name);
    mkdirif(path);
    FS.writeFileSync(path, file.data);
}

export default uploadRoute;
