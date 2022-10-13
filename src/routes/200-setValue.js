import CONST from "../constants.js";
import express from "express";
import fileUpload from "express-fileupload";
import FS, { mkdir } from "fs";
import Jobs from "../api/Jobs.js";
import Path from "path";
import { mkdirif } from "@thaerious/utility";

const uploadRoute = express.Router();
uploadRoute.use(fileUpload({ createParentPath: true }));

uploadRoute.post(CONST.URL.SET_VALUE, (req, res, next) => {
    const jobid = req.body?.jobid || req.query?.jobid;
    const key = req.body?.key || req.query?.key;
    const value = req.body?.value || req.query?.value;

    if (!jobid) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.SET_VALUE,
            message: "missing parameter 'jobid'",
        });
    }

    if (!key) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.SET_VALUE,
            message: "missing parameter 'key'",
        });
    }

    if (!value) {
        return res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.SET_VALUE,
            message: "missing parameter 'value'",
        });
    }

    try {
        const record = Jobs.instance.getJobRecord(jobid);
        record.settings[key] = value;
        Jobs.instance.saveRecord(record);

        res.write(JSON.stringify({
            status: CONST.STATUS.OK,
            route: CONST.URL.SET_VALUE,
            record: record
        }, null, 2));
        res.end();

    } catch (error) {
        logger.log(new Date().toLocaleString());
        logger.log(CONST.URL.GET_JOB_RECORD);
        logger.log(error);
        console.log(error);
        res.json({
            status: CONST.STATUS.ERROR,
            route: CONST.URL.SET_VALUE,
            message: error.message
        });
    }
    
    res.end();
});

function saveZipFile(record, file) {
    mkdirif(record.dataPath());
    const path = Path.join(record.dataPath(), file.name);
    mkdirif(path);
    FS.writeFileSync(path, file.data);
}

export default uploadRoute;
