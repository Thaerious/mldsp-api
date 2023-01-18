import logger from "./setupLogger.js";

class Settings {
    constructor(dir = "data") {
        this.DATA_DIR = {
            ROOT: `${dir}/`,
            USERS: `${dir}/users/`,
            TEMP: `${dir}/temp/`,
        }
    }

    static instance(datapath = "data") {
        if (!Settings._instance) {
            logger.verbose(`Constructing new settings with datapath = '${datapath}'`);
            Settings._instance = new Settings(datapath);
        }
        return Settings._instance;
    }
}

export default Settings;