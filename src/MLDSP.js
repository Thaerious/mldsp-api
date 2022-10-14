import CONST from "./constants.js";
import child_process from "child_process";
import logger from "./setupLogger.js";
import Jobs from "./Jobs.js";
import FS from "fs";
import Path from "path";

/**
 * Interface to MLDSP cli.
 */
class MLDSP {
    async run(jobRecord) {    
        this.jobRecord = jobRecord;

        const settings = {
            kvalue: 3,
            folds: 10,
            ... jobRecord.settings
        }

        const cmd =
            `${CONST.PATH.MLDSP_EXE} ` +
            `${jobRecord.dataPath()}/fastas/ ` +
            `${jobRecord.dataPath()}/metadata.csv ` +
            `-k ${settings.kvalue} ` +
            `-o ${jobRecord.resultsPath()} ` +
            `-r ${jobRecord.jobid} ` +
            `-f ${settings.folds} ` +
            `-z -j `;

        logger.log(new Date().toLocaleString());
        logger.log(cmd);
        console.log(cmd);
        this.startProcess(cmd);
    }

    /**
     * Start and record a new process.
     * Will remove self from this.processes when complete.
     * Updates database when complete.
     */
    startProcess(cmd) {
        return new Promise(async (resolve, reject) => {
            this.jobRecord.status = CONST.STATUS.RUNNING;
            await Jobs.instance.saveRecord(this.jobRecord);

            this.processes = child_process.exec(cmd, async (err, stdout, stderr) => {
                if (err) {
                    this.jobRecord.status = CONST.STATUS.ERROR;
                    await Jobs.instance.saveRecord(this.jobRecord);
                    reject(err);
                } else {
                    this.jobRecord.status = CONST.STATUS.COMPLETE;
                    await Jobs.instance.saveRecord(this.jobRecord);
                    const path = Path.join(this.jobRecord.resultsJSON());
                    FS.writeFileSync(path, stdout);
                    resolve(stdout);
                }
            });
        });
    }
}

export default MLDSP;