import assert from "assert";
import FS from "fs";
import Path from "path";
import CONST from "../src/constants.js";
import Jobs from "../src/Jobs.js";
import Server from "../src/Server.js";
import { uploadData, callRoute } from "./helpers/helpers.js";

// Test the server operating normally with correct inputs.
describe("testServerNormal.js : Test the Server in Normal Operation", function () {

    before(function () {
        CONST.DATA.ROOT = "./test/temp/users";
    });

    before(async function () {
        if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
        FS.mkdirSync(Path.join(CONST.DATA.ROOT), { recursive: true });
        Jobs.instance.reset().load();
        this.server = await new Server().init("./src/routes");
    });

    describe('test routes in normal operation on empty server', async function () {
        describe(`create new job record`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.CREATE_JOB, "userid=user@test");
            });

            it(`return status ok`, async function () {
                console.log(this.body);
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.CREATE_JOB);
            });

            it(`new record on empty server has job id 0`, async function () {
                assert.strictEqual(this.body.jobid, 0);
            });
        });

        describe(`retrieve job record (of new job)`, async function () {
            before(async function () {
                this.timeout(25000);
                this.body = await callRoute(this.server, CONST.URLS.GET_JOB_RECORD, "jobid=0");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.GET_JOB_RECORD);
            });

            it(`has a record field`, async function () {
                assert.ok(this.body.record);
            });           
            
            it(`record status is pending`, async function () {
                assert.strictEqual(this.body.record.status, CONST.STATUS.PENDING);
            });         
            
            it(`record has no zip file`, async function () {
                assert.strictEqual(this.body.record.zipfile, "");
            });      
            
            it(`record has job id`, async function () {
                assert.strictEqual(this.body.record.jobid, 0);
            });              

            it(`record has user id`, async function () {
                assert.strictEqual(this.body.record.userid, "user@test");
            });                          
        });   

        describe(`upload dataset to the server`, async function () {
            before(async function () {
                this.body = await uploadData(this.server, 0);
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.UPLOAD_DATA);
            });
        });

        describe(`retrieve job record (of ready job)`, async function () {
            before(async function () {
                this.timeout(25000);
                this.body = await callRoute(this.server, CONST.URLS.GET_JOB_RECORD, "jobid=0");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.GET_JOB_RECORD);
            });

            it(`has a record field`, async function () {
                assert.ok(this.body.record);
            });           
            
            it(`record status is pending`, async function () {
                assert.strictEqual(this.body.record.status, CONST.STATUS.PENDING);
            });         
            
            it(`record has a zip file`, async function () {
                assert.strictEqual(this.body.record.zipfile, "NotPrimates.zip");
            });              
        });   

        describe(`start the job`, async function () {
            before(async function () {
                this.timeout(25000);
                this.body = await callRoute(this.server, CONST.URLS.START_JOB, "jobid=0");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.START_JOB);
            });
        });   
        
        describe(`retrieve job record (of finished job)`, async function () {
            before(async function () {
                this.timeout(25000);
                this.body = await callRoute(this.server, CONST.URLS.GET_JOB_RECORD, "jobid=0");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.GET_JOB_RECORD);
            });

            it(`has a record field`, async function () {
                assert.ok(this.body.record);
            });           
            
            it(`record status is complete`, async function () {
                assert.strictEqual(this.body.record.status, CONST.STATUS.COMPLETE);
            });              
        });    
        
        describe(`create second job record`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.CREATE_JOB, "userid=user@test");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.CREATE_JOB);
            });

            it(`second new record on empty server has job id 1`, async function () {
                assert.strictEqual(this.body.jobid, 1);
            });
        });       
        
        describe(`retrieve list of all records (2 jobs)`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.ALL_JOBS);
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.ALL_JOBS);
            });

            it(`there will be 2 records in the result`, async function () {
                const records = this.body.records;
                const actual = Object.keys(records).length;
                assert.strictEqual(actual, 2);
            });
        });      
        
        describe(`set a value in a job`, async function () {
            before(async function () {
                const args = "key=my_key&value=my_value&jobid=1"
                this.body = await callRoute(this.server, CONST.URLS.SET_VALUE, args);
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.SET_VALUE);
            });

            it(`the record's settings field will contain the value`, async function () {
                const res = await callRoute(this.server, CONST.URLS.GET_JOB_RECORD, "jobid=1");
                const record = res.record;
                assert.strictEqual(record.settings["my_key"], "my_value");
            });
        });   

        describe(`create third job record with a different user`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.CREATE_JOB, "userid=user2@test");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.CREATE_JOB);
            });
        });    

        describe(`retrieve list of all records (2 jobs) for first user`, async function () {
            before(async function () {
                const msg = "userid=user@test";
                this.body = await callRoute(this.server, CONST.URLS.LIST_JOBS, msg);
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.LIST_JOBS);
            });

            it(`there will be 2 records in the result`, async function () {
                const records = this.body.records;
                const actual = Object.keys(records).length;
                assert.strictEqual(actual, 2);
            });
        });   

        describe(`retrieve the results for the first job`, async function () {
            before(async function () {
                const msg = "jobid=0";
                this.body = await callRoute(this.server, CONST.URLS.RETRIEVE_RESULTS, msg);
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.RETRIEVE_RESULTS);
            });

            it(`result exists`, async function () {
                const results = this.body.results;
                assert.ok(results);
            });
        });  

        describe(`delete the second job`, async function () {
            before(async function () {
                this.body = await callRoute(this.server, CONST.URLS.DELETE_JOB, "jobid=1");
            });

            it(`return status ok`, async function () {
                assert.strictEqual(this.body.status, CONST.STATUS.OK);
            });

            it(`return url (route) correct`, async function () {
                assert.strictEqual(this.body.route, CONST.URLS.DELETE_JOB);
            });

            it(`get_all returns 2 records`, async function () {
                const allJobs = await callRoute(this.server, CONST.URLS.ALL_JOBS);
                const records = allJobs.records;                
                const actual = Object.keys(records).length;
                assert.strictEqual(actual, 2);
            });
        });    
    });
});
