import assert from "assert";
import FS from "fs";
import Path from "path";
import CONST from "../../src/constants.js";
import Jobs from "../../src/Jobs.js";
import request from "supertest";
import Server from "../../src/Server.js";

CONST.DATA.ROOT = "./test/temp/users";

if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
FS.mkdirSync(Path.join(CONST.DATA.ROOT), { recursive: true });
Jobs.instance.reset().load();
const server = await new Server().init("./src/routes");

request(server.app)
    .post(CONST.URL.CREATE_JOB)
    .send(`userid=ima@id`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
        console.log(JSON.stringify(res, null, 2));
        console.log(res.body)
    }); 

request(server.app)
    .post(CONST.URL.UPLOAD_DATA)
    .field("jobid", "0")
    .field('complex_object', '{}', { contentType: 'application/json' })
    .attach('fileupload', './test/assets/NotPrimates.zip')
    .end((err, res) => {
        console.log(JSON.stringify(res, null, 2));
        console.log(res.body)
    });