import CONST from "./constants.js";
import child_process from "child_process";
import logger from "./setupLogger.js";
import Jobs from "./Jobs.js";
import FS from "fs";
import Status from "./Status.js";

/**
 * Interface to MLDSP cli.
 */
class MLDSP {
    async run(jobRecord) { 
        this.jobRecord = jobRecord;
        this.precheck();

        Status.instance.status = Status.VALUES.BUSY;

        const settings = {
            kvalue: 3,
            folds: 3,
            ... jobRecord.settings
        }

        const cmd =
            `${CONST.PATH.MLDSP_EXE} ` +
            `${jobRecord.dataDir()}/fastas/ ` +
            `${jobRecord.dataDir()}/metadata.csv ` +
            `-k ${settings.kvalue} ` +
            `-o ${jobRecord.resultsDir()} ` +
            `-r ${jobRecord.jobid} ` +
            `-f ${settings.folds} ` +
            `-z -j `;

        logger.log(cmd);
        await this.startProcess(cmd);
        Status.instance.status = Status.VALUES.IDLE;
    }

    precheck() {
        if (!FS.existsSync(this.jobRecord.dataDir())) {
            throw new Error(`missing data directory '${this.jobRecord.dataDir()}'`);            
        }
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
                    FS.writeFileSync(this.jobRecord.resultsJSONPath(), stdout);
                    resolve(stdout);
                }
            });
        });
    }
}

export default MLDSP;