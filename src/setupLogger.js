import Logger from "@thaerious/logger";
import {mkdirif} from "@thaerious/utility";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs"

function joinDate(t, a, s) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format).join(s);
 }

function getLogFile() {
    const dateArray = [{year: 'numeric'}, {month: 'short'}, {day: 'numeric'}];
    const dateString = joinDate(new Date, dateArray, '_');
    return Path.join("log", dateString + ".txt");    
}

const options = {
    flags: [
        {
            long: `verbose`,
            short: `v`,
            type: `boolean`
        }
    ]
};

const args = new ParseArgs().loadOptions(options).run();
const appLogger = new Logger();

appLogger.channel(`standard`).enabled = true;
appLogger.channel(`error`).enabled = true;
appLogger.channel(`log`).enabled = true;
appLogger.channel(`verbose`).enabled = false;

if (args.flags["verbose"]) appLogger.channel(`verbose`).enabled = true;

appLogger.channel(`log`).log = (text) => {
    FS.appendFileSync(getLogFile(), text + "\n");
}

appLogger.channel("error").log = function(string){
    console.error("Error: see log files");
    const path = mkdirif(process.env.LOG_DIR, "error.log");
    FS.appendFileSync(path, "\n *** " + new Date().toString() + "\n" + string + "\n");
}

export default appLogger.all();