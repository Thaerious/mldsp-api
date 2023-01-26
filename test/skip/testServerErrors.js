import assert from "assert";
import FS from "fs";
import Path from "path";
import CONST from "../../src/constants.js";
import Jobs from "../../src/Jobs.js";
import Server from "../../src/Server.js";
import { uploadData, callRoute } from "../helpers/helpers.js";

describe("testServerErrors.js : Test the Server in Abnormal Operation", function () {

    before(function () {
        CONST.DATA.ROOT = "./test/temp/users";
    });

    before(async function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(Path.join(CONST.DATA.ROOT), { recursive: true });
        Jobs.instance.reset().load();
        this.server = await new Server().init("./src/routes");
    });

    describe('test routes in abnormal operation on empty server', async function () {
        describe(`create new job record - missing userid`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.CREATE_JOB);
            });

            it(`return status error`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.ERROR);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.CREATE_JOB);
            });
        });

        describe('upload a zip file missing the metadata.csv file', async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.CREATE_JOB, {userid : "error@test"});
                this.body = await uploadData(this.server, this.body.jobid, "MissingCSV.zip");
            });

            it(`return status error`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.ERROR);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.UPLOAD_DATA);
            });
        });
    });
});