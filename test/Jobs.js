import assert from "assert";
import CONST from "../src/constants.js";
import Jobs from "../src/api/Jobs.js";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

describe("Test Jobs class", function () {
    before(function () {
        CONST.DATA.ROOT = "./test/temp/users";
    });

    before(function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(Path.join(CONST.DATA.ROOT), {recursive : true});
        Jobs.instance.reset().load();
    });

    after(function () {
        if (!args.flags["no-clean"]) {
            if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        }
    });

    describe("add a new job", async function (){
        it("adds the job returning jobid which is 0 for a new Jobs object", async function (){
            this.record = await Jobs.instance.addJob("user@test", "job description"); 
            const actual = this.record.jobid;
            const expected = 0;
            assert.strictEqual(actual, expected);
        });

        it("subsequent adds increment the jobid", async function (){
            this.record = await Jobs.instance.addJob("user@test", "second job description", "Primates", {}); 
            const actual = this.record.jobid;
            const expected = 1;
            assert.strictEqual(actual, expected);
        });

        it("a record.json file was created", async function (){
            const path = Path.join(CONST.DATA.ROOT, "user@test", "0", CONST.DATA.RECORD_FILENAME);
            const actual = FS.existsSync(path);
            const expected = true;
            assert.strictEqual(actual, expected);
        });

        it("retrieve a specific job by id", async function (){
            assert.ok(Jobs.instance.getJobRecord(0));
        });

        it("retrieve all jobs by userid", async function (){
            const jobs = Jobs.instance.listJobs("user@test");
            assert.ok(jobs[0]);
            assert.ok(jobs[1]);
        });

        it("returned records are non-reflective (addJob)", async function (){
            const record = await Jobs.instance.addJob("ima@user", "job description"); 
            const expected = record.userid;
            record.userid = "xxx";

            const actual = Jobs.instance.getJobRecord(record.jobid).userid;            
            assert.strictEqual(actual, expected);
        });  
        
        it("returned records are non-reflective (saveRecord)", async function (){
            const record0 = await Jobs.instance.addJob("ima@user", "job description");            
            const record = await Jobs.instance.saveRecord(record0);  
            record.userid = "xxx";

            const actual = Jobs.instance.getJobRecord(record.jobid).userid;            
            assert.strictEqual(actual, "ima@user");
        });          

        it("returned records are non-reflective (getJobRecord)", async function (){
            const r = await Jobs.instance.addJob("ima@user", "job description");                        
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";           
            const actual = Jobs.instance.getJobRecord(record.jobid).userid;            
            assert.strictEqual(actual, "ima@user");
        });              

        it("returned records are non-reflective (jobList)", async function (){
            const r = await Jobs.instance.addJob("ima@user", "job description");                        
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";           
            const list = Jobs.instance.listJobs("ima@user");     
            const actual = list[r.jobid].userid;
            assert.strictEqual(actual, "ima@user");
        });              

        it("returned records are non-reflective (allJobs)", async function (){
            const r = await Jobs.instance.addJob("ima@user", "job description");                        
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";           
            const list = Jobs.instance.allJobs();     
            const actual = list[r.jobid].userid;
            assert.strictEqual(actual, "ima@user");
        });  

    });

    describe("add a value to a record", async function () {
        before(async function () {
            const r = await Jobs.instance.addJob("test@value", "add a value");
            this.jobid = r.jobid;
            const record = await Jobs.instance.getJobRecord(this.jobid);
            record.settings["key"] = "value";
            await Jobs.instance.saveRecord(record);            
        });

        it("the value exists when retrieving the record", async function (){            
            const record = Jobs.instance.getJobRecord(this.jobid);
            const actual = record.settings.key;
            const expected = "value";                       
            assert.strictEqual(actual, expected);
        });

        it("the value exists when loading a new instance", async function (){            
            const instance = new Jobs().load();
            const record = instance.getJobRecord(this.jobid);
            const actual = record.settings.key;
            const expected = "value";                       
            assert.strictEqual(actual, expected);
        });
    });

    describe("delete a record", async function () {
        before(async function () {
            const r = await Jobs.instance.addJob("test@delete", "delete a record");
            this.jobid = r.jobid;
            await Jobs.instance.deleteJob(this.jobid);
        });

        it("the record does not exist in the active instance", async function (){            
            const actual = Jobs.instance.hasJob(this.jobid);
            const expected = false;      
            assert.strictEqual(actual, expected);
        });

        it("the value does not exist in a new instance", async function (){            
            const instance = new Jobs().load();
            const actual = instance.hasJob(this.jobid);
            const expected = false;                       
            assert.strictEqual(actual, expected);
        });
    });    
});
