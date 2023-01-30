import assert from "assert";
import CONST from "../src/constants.js";
import Jobs from "../src/Jobs.js";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

describe("Jobs.js : Test Jobs class", function () {
    before(function () {
        CONST.DATA.ROOT = "test/temp";
    });

    before(function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(process.env.DATA, { recursive: true });
        Jobs.instance.reset().load();
    });

    after(function () {
        if (!args.flags["no-clean"]) {
            if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        }
    });

    describe("add a new job", async function () {
        it("adds the job returning jobid which is 0 for a new Jobs object", async function () {
            this.record = await Jobs.instance.addJob("user@test", "job description");
            const actual = this.record.jobid;
            const expected = 0;
            assert.strictEqual(actual, expected);
        });

        it("subsequent adds increment the jobid", async function () {
            this.record = await Jobs.instance.addJob("user@test", "second job description", "Primates", {});
            const actual = this.record.jobid;
            const expected = 1;
            assert.strictEqual(actual, expected);
        });

        it("a record.json file was created", async function () {
            const path = Path.join(CONST.DATA.ROOT, CONST.DATA.SUB.USERS, "user@test", "0", CONST.DATA.FILE.RECORD);
            const actual = FS.existsSync(path);
            const expected = true;
            assert.strictEqual(actual, expected);
        });

        it("retrieve a specific job by id", async function () {
            assert.ok(Jobs.instance.getJobRecord(0));
        });

        it("retrieve all jobs by userid", async function () {
            const jobs = Jobs.instance.listJobs("user@test");
            assert.ok(jobs[0]);
            assert.ok(jobs[1]);
        });

        it("returned records are non-reflective (addJob)", async function () {
            const record = await Jobs.instance.addJob("ima@user", "job description");
            const expected = record.userid;
            record.userid = "xxx";

            const actual = Jobs.instance.getJobRecord(record.jobid).userid;
            assert.strictEqual(actual, expected);
        });

        it("returned records are non-reflective (saveRecord)", async function () {
            const record0 = await Jobs.instance.addJob("ima@user", "job description");
            const record = await Jobs.instance.saveRecord(record0);
            record.userid = "xxx";

            const actual = Jobs.instance.getJobRecord(record.jobid).userid;
            assert.strictEqual(actual, "ima@user");
        });

        it("returned records are non-reflective (getJobRecord)", async function () {
            const r = await Jobs.instance.addJob("ima@user", "job description");
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";
            const actual = Jobs.instance.getJobRecord(record.jobid).userid;
            assert.strictEqual(actual, "ima@user");
        });

        it("returned records are non-reflective (jobList)", async function () {
            const r = await Jobs.instance.addJob("ima@user", "job description");
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";
            const list = Jobs.instance.listJobs("ima@user");
            const actual = list[r.jobid].userid;
            assert.strictEqual(actual, "ima@user");
        });

        it("returned records are non-reflective (allJobs)", async function () {
            const r = await Jobs.instance.addJob("ima@user", "job description");
            const record = Jobs.instance.getJobRecord(r.jobid);
            record.userid = "xxx";
            const list = Jobs.instance.allJobs();
            const actual = list[r.jobid].userid;
            assert.strictEqual(actual, "ima@user");
        });

        describe("check the saved job fields", async function () {
            const r = await Jobs.instance.addJob("ima@user", "job description");
            const recordBefore = Jobs.instance.getJobRecord(r.jobid);

            recordBefore.zipfile = "Ima zip file";
            recordBefore.settings.alpha = "a";
            Jobs.instance.saveRecord(recordBefore);

            Jobs.instance.reset();
            Jobs.instance.load();
            const recordAfter = Jobs.instance.getJobRecord(r.jobid);

            it("checking for field parity", async function () {
                assert.deepEqual(recordAfter, recordBefore);
            });
        });

        describe("check the saved job fields - status complete", async function () {
            const r = await Jobs.instance.addJob("ima@user", "job description");
            const recordBefore = Jobs.instance.getJobRecord(r.jobid);

            recordBefore.zipfile = "Ima zip file";
            recordBefore.settings.alpha = "a";
            recordBefore.status = CONST.STATUS.COMPLETE;
            Jobs.instance.saveRecord(recordBefore);

            Jobs.instance.reset();
            Jobs.instance.load();
            const recordAfter = Jobs.instance.getJobRecord(r.jobid);

            it("checking for field parity", async function () {
                assert.deepEqual(recordAfter, recordBefore);
            });
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

        it("the value exists when retrieving the record", async function () {
            const record = Jobs.instance.getJobRecord(this.jobid);
            const actual = record.settings.key;
            const expected = "value";
            assert.strictEqual(actual, expected);
        });

        it("the value exists when loading a new instance", async function () {
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

        it("the record does not exist in the active instance", async function () {
            const actual = Jobs.instance.hasJob(this.jobid);
            const expected = false;
            assert.strictEqual(actual, expected);
        });

        it("the value does not exist in a new instance", async function () {
            const instance = new Jobs().load();
            const actual = instance.hasJob(this.jobid);
            const expected = false;
            assert.strictEqual(actual, expected);
        });
    });

    describe("check record paths", async function () {
        it("plain path is $ROOT -> users -> $USERID -> $JOBID", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");

            const actual = record.rootDir();
            const expected = "test/temp/users/test@delete/0";
            assert.strictEqual(actual, expected);
        });

        it("record path is $ROOT -> users -> $USERID -> $JOBID -> record.json", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");

            const actual = record.recordPath();
            const expected = "test/temp/users/test@delete/0/record.json";
            assert.strictEqual(actual, expected);
        });

        it("data path is $ROOT -> users -> $USERID -> $JOBID -> data", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");

            const actual = record.dataDir();
            const expected = "test/temp/users/test@delete/0/data";
            assert.strictEqual(actual, expected);
        });

        it("temp path is $ROOT -> users -> $USERID -> $JOBID -> unzipped", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");

            const actual = record.tempDir();
            const expected = "test/temp/users/test@delete/0/temp";
            assert.strictEqual(actual, expected);
        });

        it("zip path is $ROOT -> users -> $USERID -> $JOBID -> $FILENAME", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");
            record.zipfile = "file.zip"

            const actual = record.zipPath();
            const expected = "test/temp/users/test@delete/0/file.zip";
            assert.strictEqual(actual, expected);
        });

        it("results path is $ROOT -> users -> $USERID -> $JOBID -> results", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");
            record.zipfile = "file.zip"

            const actual = record.resultsDir();
            const expected = "test/temp/users/test@delete/0/results";
            assert.strictEqual(actual, expected);
        });

        it("results path is $ROOT -> users -> $USERID -> $JOBID -> results -> results.json", async function () {
            Jobs.instance.reset();
            const record = await Jobs.instance.addJob("test@delete", "delete a record");
            record.zipfile = "file.zip"

            const actual = record.resultsJSONPath();
            const expected = "test/temp/users/test@delete/0/results/results.json";
            assert.strictEqual(actual, expected);
        });
    });
});
