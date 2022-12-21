import request from "supertest";
import CONST from "../../src/constants.js";
import Path from "path";

async function uploadData(server, jobid, filename = "NotPrimates.zip", url = CONST.URLS.UPLOAD_DATA) {
    let body = {};
    const path = Path.join("test", "assets", filename);

    await request(server.app)
        .post(url)
        .field("jobid", "" + jobid)
        .field('complex_object', '{}', { contentType: 'application/json' })
        .attach('fileupload', path)
        .then(res => {
            body = res.body;
        });

    return body;
}

async function callRoute(server, url, send = "") {
    var body = {};

    await request(server.app)
        .post(url)
        .send(send)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
            body = res.body;
        });

    return body;
}

export { callRoute, uploadData }