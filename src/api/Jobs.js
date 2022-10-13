import CONST from "../constants.js";
import { Mutex } from "async-mutex";
import Path from "path";
import FS, { mkdir } from "fs";
import getInfoFiles from "./getInfoFiles.js";
import { mkdirif, fsjson } from "@thaerious/utility";

const mutex = new Mutex();

class JobRecord{
    constructor(userid, jobid, desc, status = CONST.STATUS.PENDING) {
        this.userid = userid;
        this.jobid = jobid;
        this.desc = desc;
        this.status = CONST.STATUS.PENDING;
        this.settings = {};        
    };

    static fromFile(path){
        const contents = fsjson.load(path);
        return new JobRecord(contents.userid, contents.jobid, contents.desc, contents.status);
    }

    path() {
        return Path.join(CONST.DATA.USER, this.jobid.toString());
    }

    recordPath() {
        return Path.join(this.path(), CONST.DATA.RECORD_FILENAME);
    }

    dataPath() {
        return Path.join(this.path(), CONST.DATA.DATA_SUB);
    }

    resultsPath() {
        return Path.join(this.path(), CONST.DATA.DATA_SUB);
    }    

    mkdir() {
        FS.mkdirSync(this.dataPath(), { recursive: true });
        FS.mkdirSync(this.resultsPath(), { recursive: true });
    }

    saveToFile() {
        mkdirif(this.recordPath());
        FS.writeFileSync(this.recordPath(), this.toJSON());
    }
}

class Jobs{
    constructor(){
        this.jobStore = {};      
        this.loaded = false;  
    }
   
    reset(){
        this.jobStore = {};      
        this.loaded = false;  
        return this;
    }

    /**
     * Loads jobRecord files from the results directory.
     * They get stored as job records, by job id, in this.jobstore.
     */
    onLoad(){
        if (this.loaded) return
        this.loaded = true;
        
        mkdirif(CONST.DATA.USER);
        const infoFilePaths =  getInfoFiles(CONST.DATA.USER);
        
        for (const path of infoFilePaths){
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
    async addJob(userid, jobname, dataset, settings = {}){
        let jobid = await this.nextIndex();
        const jobRecord = new JobRecord(userid, jobid, jobname, dataset, settings);
        jobRecord.saveToFile();
        this.jobStore[jobid] = jobRecord;
                
        return jobRecord;
    }

    /**
     * Remove the job record and the job results directory.
     */
    deleteJob(jobid){
        if (!this.hasJob(jobid)) return;
        const record = this.getJob(jobid);
        const path = record.user.resultPath(jobid);
        if (FS.existsSync(path)) FS.rmSync(path, {recursive: true});
        delete this.jobStore[jobid];
    }

    /**
     * Retrieve a list of all job ids associated with a given user id.
     */
    listJobs(userid){
        const jobList = {};
        for (const jobid in this.jobStore){            
            if (this.jobStore[jobid].userid === userid){
                jobList[jobid] = this.jobStore[jobid];
            }
        }

        return jobList;
    }

    getJob(jobid){
        if (!this.jobStore[jobid]) throw new Error(`Unknown job id: ${jobid}`);
        return this.jobStore[jobid];
    }

    hasJob(jobid){
        return this.jobStore[jobid] !== undefined;
    }

    async nextIndex(){
        const release = await mutex.acquire();
        let index = 0;
        while(this.jobStore[index]) index++;
        release();
        return index;
    }

    static get instance(){
        if (!Jobs._instance) Jobs._instance = new Jobs().onLoad();
        return Jobs._instance;
    }
}

export {Jobs as default, JobRecord};