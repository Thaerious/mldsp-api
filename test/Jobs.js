import assert from "assert";
import CONST from "../src/constants.js";
import Jobs from "../src/api/Jobs.js";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

describe("Test Jobs class", function () {
    before(function () {
        CONST.DATA.USER = "./test/temp/users";
    });

    before(function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(Path.join(CONST.DATA.USER), {recursive : true});
        Jobs.instance.reset().onLoad();
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
            const path = Path.join(CONST.DATA.USER, "0", CONST.DATA.RECORD_FILENAME);
            const actual = FS.existsSync(path);
            const expected = true;
            assert.strictEqual(actual, expected);
        });

        it("retrieve a specific job by id", async function (){
            assert.ok(Jobs.instance.getJob(0));
        });

        it("retrieve all jobs by userid", async function (){
            const jobs = Jobs.instance.listJobs("user@test");
            assert.ok(jobs[0]);
            assert.ok(jobs[1]);
        });
    });
});
