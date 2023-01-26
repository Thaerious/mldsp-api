import CONST from "./constants.js";
import { Mutex } from "async-mutex";
import Path from "path";
import FS, { mkdir } from "fs";
import getInfoFiles from "./getInfoFiles.js";
import { mkdirif, fsjson } from "@thaerious/utility";
import lodash from "lodash";

const mutex = new Mutex();

class JobRecord {
    constructor(userid, jobid, desc, settings = {}, status = CONST.STATUS.PENDING) {
        this.userid = userid;
        this.jobid = jobid;
        this.desc = desc;
        this.status = CONST.STATUS.PENDING;
        this.zipfile = "";
        this.settings = settings;
    };

    static fromFile(path) {
        const contents = fsjson.load(path);
        const record = new JobRecord(contents.userid, contents.jobid, contents.desc, contents.settings, contents.status);
        record.zipfile = contents.zipfile;
        return record;
    }

    rootDir() {
        return Path.join(CONST.DATA.ROOT, CONST.DATA.SUB.USERS, this.userid, this.jobid.toString());
    }

    recordPath() {
        return Path.join(this.rootDir(), CONST.DATA.FILE.RECORD);
    }

    dataDir() {
        return Path.join(this.rootDir(), CONST.DATA.SUB.DATA);
    }

    // Temporary location for unzipped data.
    tempDir() {
        return Path.join(this.rootDir(), CONST.DATA.SUB.TEMP);
    }

    // The location of the uploaded data (zip) file.
    zipPath() {
        return Path.join(this.rootDir(), this.zipfile);
    }

    resultsDir() {
        return Path.join(this.rootDir(), CONST.DATA.SUB.RESULT);
    }

    resultsJSONPath() {
        return Path.join(this.rootDir(), CONST.DATA.SUB.RESULT, CONST.DATA.FILE.RESULTS);
    }

    saveToFile() {
        mkdirif(this.recordPath());
        FS.writeFileSync(this.recordPath(), JSON.stringify(this));
    }
}

class Jobs {
    constructor() {
        this.nextID = 0;
        this.jobStore = {};
        this.loaded = false;
    }

    reset() {
        this.nextID = 0;
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
        mkdirif(CONST.DATA.ROOT, CONST.DATA.SUB.USERS, "/");
        const infoFilePaths = getInfoFiles(Path.join(CONST.DATA.ROOT, CONST.DATA.SUB.USERS));

        for (const path of infoFilePaths) {
            const record = JobRecord.fromFile(path);
            if (this.jobStore[record.jobid]) throw new Error(`Duplicate job id: ${record.jobid} ${path}`);
            this.jobStore[record.jobid] = record;
            if (this.nextID <= record.jobid) this.nextID = record.jobid + 1;
        }

        return this;
    }

    /**
     * Adds a new job, returns a unique job id.
     * Writes the job record to infopath.
     * After this method is called all paths will have been created.
     */
    async addJob(userid, jobname, dataset) {
        const jobid = await this.nextIndex();
        const record = new JobRecord(userid, jobid, jobname, dataset);
        this.saveRecord(record)
        return lodash.cloneDeep(record);
    }

    saveRecord(record) {
        const jobid = record.jobid;
        record.saveToFile();
        this.jobStore[jobid] = record;
        return lodash.cloneDeep(record);
    }

    /**
     * Remove the job record and the job results directory.
     */
    deleteJob(jobid) {        
        if (!this.hasJob(jobid)) return;
        const record = this.getJobRecord(jobid);
        const path = record.rootDir();
        if (FS.existsSync(path)) FS.rmSync(path, { recursive: true });
        delete this.jobStore[jobid];    
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
        let index = this.nextID++;
        release();
        return index;
    }

    static get instance() {
        if (!Jobs._instance) Jobs._instance = new Jobs().load();
        return Jobs._instance;
    }
}

export { Jobs as default, JobRecord };