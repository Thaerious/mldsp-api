import assert from "assert";
import CONST from "../src/constants.js";
import Jobs from "../src/Jobs.js";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
import unpackDataset from "../src/unpackDataset.js";
const args = new ParseArgs().run();

describe("Test Upack Dataset Function", function () {

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

    describe("add a new job", async function () {
        before(async function () {
            this.record = await Jobs.instance.addJob("user@test", "job description");
            this.record.zipfile = "NotPrimates.zip";

            const from = "test/assets/NotPrimates.zip";
            const to = this.record.zipPath();
            FS.cpSync(from, to);
            await unpackDataset(this.record);
        });

        it("creates the fastas directory", async function () {            
            const actual = FS.existsSync("test/temp/users/user@test/0/data/fastas");
        });

        it("creates the metadata file", async function () {            
            const actual = FS.existsSync("test/temp/users/user@test/0/data/metadata.csv");
        });        
    });

});