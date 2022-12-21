import FS from "fs";
import Path from "path";
import CONST from "../../src/constants.js";
import Jobs from "../../src/Jobs.js";
import Server from "../../src/Server.js";
import { uploadData, callRoute } from "../helpers/helpers.js";

CONST.DATA.ROOT = "./test/temp/users";

if (FS.existsSync("test/temp")) FS.rmSync("test/temp", { recursive: true });
FS.mkdirSync(Path.join(CONST.DATA.ROOT), { recursive: true });
Jobs.instance.reset().load();
const server = await new Server().init("./src/routes");


let body = await callRoute(server, CONST.URLS.CREATE_JOB, { userid: "error@test" });
console.log(body);
body = await uploadData(server, body.jobid, "MissingCSV.zip");
console.log(body);