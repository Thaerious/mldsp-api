import CONST from "./constants.js";
import { Mutex } from "async-mutex";
import Path from "path";
import FS, { mkdir } from "fs";
import getInfoFiles from "./getInfoFiles.js";
import { mkdirif, fsjson } from "@thaerious/utility";
import lodash from "lodash";

const mutex = new Mutex();

class JobRecord {
    constructor(userid, jobid, desc, status = CONST.STATUS.PENDING, settings = {}) {
        this.userid = userid;
        this.jobid = jobid;
        this.desc = desc;
        this.status = CONST.STATUS.PENDING;
        this.settings = settings;
        this.zipfile = "";
    };

    static fromFile(path) {
        const contents = fsjson.load(path);
        const record = new JobRecord(contents.userid, contents.jobid, contents.desc, contents.status, contents.settings);
        record.zipfile = contents.zipfile;
        return record;
    }

    path() {
        return Path.join(CONST.DATA.ROOT, this.userid, this.jobid.toString());
    }

    recordPath() {
        return Path.join(this.path(), CONST.DATA.RECORD_FILENAME);
    }

    dataPath() {
        return Path.join(this.path(), CONST.DATA.DATA_SUB);
    }

    zipPath() {
        return Path.join(this.path(), this.zipfile);
    }

    resultsPath() {
        return Path.join(this.path(), CONST.DATA.RESULTS_SUB);
    }

    mkdir() {
        FS.mkdirSync(this.dataPath(), { recursive: true });
        FS.mkdirSync(this.resultsPath(), { recursive: true });
    }

    saveToFile() {
        mkdirif(this.recordPath());
        FS.writeFileSync(this.recordPath(), JSON.stringify(this));
    }
}

class Jobs {
    constructor() {
        this.jobStore = {};
        this.loaded = false;
    }

    reset() {
        this.jobStore = {};
        this.loaded = false;
        return this;
    }

    /**
     * Loads jobRecord files from the results directory.
     * They get stored as job records, by job id, in this.jobstore.
     */
    load() {
        if (this.loaded) return
        this.loaded = true;

        mkdirif(CONST.DATA.ROOT);
        const infoFilePaths = getInfoFiles(CONST.DATA.ROOT);

        for (const path of infoFilePaths) {
            const record = JobRecord.fromFile(path);
            if (this.jobStore[record.jobid]) throw new Error(`Duplicate job id: ${record.jobid} ${path}`);
            this.jobStore[record.jobid] = record;
        }

        return this;
    }

    /**
     * Adds a new job, returns a unique job id.
     * Writes the job record to infopath.
     * After this method is called all paths will have been created.
     */
    async addJob(userid, jobname, dataset, settings = {}) {
        const jobid = await this.nextIndex();
        const record = new JobRecord(userid, jobid, jobname, dataset, settings);
        this.saveRecord(record)
        return lodash.cloneDeep(record);
    }

    async saveRecord(record) {
        const jobid = record.jobid;
        record.saveToFile();
        this.jobStore[jobid] = record;
        return lodash.cloneDeep(record);
    }

    /**
     * Remove the job record and the job results directory.
     */
    deleteJob(jobid) {
        console.log("delete " + jobid);
        
        if (!this.hasJob(jobid)) return;
        const record = this.getJobRecord(jobid);
        const path = record.path();
        if (FS.existsSync(path)) FS.rmSync(path, { recursive: true });
        delete this.jobStore[jobid];

        console.log(this.jobStore);        
    }

    /**
     * Retrieve a list of all job ids associated with a given user id.
     */
    listJobs(userid) {
        const jobList = {};
        for (const jobid in this.jobStore) {
            if (this.jobStore[jobid].userid === userid) {
                jobList[jobid] = this.getJobRecord(jobid);
            }
        }

        return jobList;
    }

    allJobs() {
        const jobList = {};
        for (const jobid in this.jobStore) {
            jobList[jobid] = this.getJobRecord(jobid);
        }

        return jobList;
    }

    /**
     * Retrieve a non-reflective record.
     * @param {*} jobid 
     * @returns 
     */
    getJobRecord(jobid) {
        if (!this.jobStore[jobid]) throw new Error(`Unknown job id: ${jobid}`);
        const record = this.jobStore[jobid];
        return lodash.cloneDeep(record);
    }

    hasJob(jobid) {
        return this.jobStore[jobid] !== undefined;
    }

    async nextIndex() {
        const release = await mutex.acquire();
        let index = 0;
        while (this.jobStore[index]) index++;
        release();
        return index;
    }

    static get instance() {
        if (!Jobs._instance) Jobs._instance = new Jobs().load();
        return Jobs._instance;
    }
}

export { Jobs as default, JobRecord };