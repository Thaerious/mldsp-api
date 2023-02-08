import assert from "assert";
import CONST from "../src/constants.js";
import Jobs from "../src/Jobs.js";
import FS from "fs";
import unpackDataset from "../src/unpackDataset.js";
import { fsjson, mkdirif } from "@thaerious/utility";
import { middleware } from "../src/routes/200-startJob.js";
import ParseArgs from "@thaerious/parseargs";
const args = new ParseArgs().run();

const res = {
    set: function () { },
    write: function () { },
    end: function () { }
}

describe("200-startJob : Test Start Jobs router", function () {
    before(function () {
        CONST.DATA.ROOT = "test/temp";
    });

    before(function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(CONST.DATA.ROOT, { recursive: true });
        Jobs.instance.reset().load();
    });

    after(function () {
        if (!args.flags["no-clean"]) {
            if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        }
    });

    describe("submit job start normally", async function () {
        // Set the mocha timeout in case the call hangs
        this.timeout(10000);

        before(async function () {
            // The job requires a valid record
            this.record = await Jobs.instance.addJob("startJob@test", "job description");

            // The job requires a valid data file            
            this.record.zipfile = "NotPrimates.zip";
            const from = "test/assets/NotPrimates.zip";
            const to = this.record.zipPath();
            FS.cpSync(from, to);
            await unpackDataset(this.record);
        });

        it("run mock login", function (done) {
            // mock the request object
            const req = {
                body: {
                    jobid: this.record.jobid
                }
            }

            const res = {
                set: function () { },
                write: function (msg) { },
                end: function () {
                    setTimeout(done, 3000);
                }
            }

            middleware(req, res, null);
        });

        it("result.json file exists", async function () {
            const record = Jobs.instance.getJobRecord(this.record.jobid);
            const results = fsjson.load(record.resultsJSONPath());
            assert.ok(results);
            this.jobid = record.jobid;
        });

        it("record status indicates complete", async function () {
            const record = Jobs.instance.getJobRecord(this.record.jobid);
            assert.strictEqual(record.status, CONST.STATUS.COMPLETE);
        });
    });

    describe("submit job without zip file", async function () {
        // Set the mocha timeout in case the call hangs
        this.timeout(10000);

        before(async function () {
            // The job requires a valid record
            this.record = await Jobs.instance.addJob("startJob@test", "job description");
        });

        it("run mock login", function (done) {
            // mock the request object
            const req = {
                body: {
                    jobid: this.record.jobid
                }
            }

            const res = {
                set: function () { },
                write: function (msg) { console.log(msg)},
                end: function () { done() }
            }

            middleware(req, res, null);
        });

        it("record status indicates error", async function () {
            const record = Jobs.instance.getJobRecord(this.record.jobid);
            assert.strictEqual(record.status, CONST.STATUS.ERROR);
        });
    });    
});