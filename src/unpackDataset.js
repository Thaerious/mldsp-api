import FS, { rmSync } from "fs";
import Path from "path";
import unzipper from "unzipper";

/**
 * Add the dataset with the zip file named 'name' and data for user 'userid'.
 * The first directory found within the zip (root inclusive) that contains both
 * a "metadata.csv" file a "fastas" directory will be used as the dataset.
 * The name of the dataset will the 'name' with any extensions removed.
 * @param {string} userid
 * @param {string} name
 * @param {Buffer} data
 */
function unpackDataset(record) {
    const tempPath = Path.join(record.path(), "temp");

    return new Promise((resolve, reject) => {

        // unzip the saved file to the final destination
        FS.createReadStream(record.zipPath())
            .pipe(unzipper.Extract({ path: tempPath }))
            .on("close", () => {
                const srcPath = seekDataset(tempPath);
                if (!srcPath) {
                    reject(new Error("Missing metadata.csv in zip file."));
                } else {
                    const destPath = record.dataPath();
                    copyFile(srcPath, destPath);
                    rmSync(tempPath, { recursive: true });
                    resolve();
                }
            });
    });
}

/**
 * Copy src dir to dest dir, throws error if dest exists.
 */
function copyFile(src, dest) {
    if (FS.existsSync(dest)) return false;
    FS.cpSync(src, dest, { recursive: true });
    return true;
}

/**
 * Recrusivly search path for the first directory that has both a "metadata.csv" file
 * and a "fastas" directory.  Does not handle virtual links.
 * @return the path to the dataset, or undefined
 */
function seekDataset(root) {
    const metadataPath = Path.join(root, "metadata.csv");
    const fastasPath = Path.join(root, "fastas");

    if (FS.existsSync(metadataPath) && FS.existsSync(fastasPath)) return root;
    const contents = FS.readdirSync(root, { withFileTypes: true });
    for (const dirEntry of contents) {
        if (dirEntry.isDirectory()) {
            return seekDataset(Path.join(root, dirEntry.name));
        }
    }

    return undefined;
}

export default unpackDataset;
