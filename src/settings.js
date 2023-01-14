class Settings {
    constructor(dir = "data") {
        this.DATA_DIR = {
            ROOT: `${dir}/`,
            USERS: `${dir}/users/`,
            TEMP: `${dir}/temp/`,
        }
    }

    static instance(port) {
        if (!Settings._instance) {
            console.log(`Constructing new settings with port ${port}`);
            Settings._instance = new Settings(port);
        }
        return Settings._instance;
    }
}

export default Settings;