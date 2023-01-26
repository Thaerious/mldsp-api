import FS from "fs";
import { mkdirif } from "@thaerious/utility";
import Jobs from "../src/Jobs.js";
import MLDSP from "../src/MLDSP.js";
import unpackDataset from "../src/unpackDataset.js";
import CONST from "../src/constants.js";

CONST.DATA.ROOT = "./test/temp";

await (async () => {
    const record = await Jobs.instance.addJob("mldsp@test", "sanity test");

    const from = "test/assets/Influenza.zip";
    const to = mkdirif(record.zipPath(), "Influenza.zip");
    FS.cpSync(from, to);

    record.zipfile = "Influenza.zip";
    Jobs.instance.saveRecord(record);

    await unpackDataset(record);
    await new MLDSP().run(record);
})()