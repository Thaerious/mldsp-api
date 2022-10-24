import assert from "assert";
import FS from "fs";
import Path from "path";
import { fsjson, mkdirif } from "@thaerious/utility";
import CONST from "../src/constants.js";
import Jobs from "../src/Jobs.js";
import MLDSP from "../src/MLDSP.js";
import unpackDataset from "../src/unpackDataset.js";

describe("Test MLDSP action", function () {

    before(function () {
        CONST.DATA.ROOT = "./test/temp/users";
    });

    before(function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(Path.join(CONST.DATA.ROOT), { recursive: true });
        Jobs.instance.reset().load();
    });

    describe("submit a job", async function () {
        before(async function () {
            this.timeout(25000);
            const record = await Jobs.instance.addJob("mldsp@test", "sanity test");

            const from = "test/assets/NotPrimates.zip";
            const to = mkdirif(record.zipPath(), "NotPrimates.zip");
            FS.cpSync(from, to);

            record.zipfile = "NotPrimates.zip";
            Jobs.instance.saveRecord(record);

            await unpackDataset(record);
            await new MLDSP().run(record);

            this.jobid = record.jobid;
        });

        it("sanity: result isn't undefined", async function () {
            const record = Jobs.instance.getJobRecord(this.jobid);
            const results = fsjson.load(record.resultsJSON());
            assert.ok(results);
            this.jobid = record.jobid;
        });

        it("job record updated with complete", function () {
            const record = Jobs.instance.getJobRecord(this.jobid);
            const expected = CONST.STATUS.COMPLETE;
            const actual = record.status;
            assert.strictEqual(expected, actual);
        });
    });
});
