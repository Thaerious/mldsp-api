import Express from "express";
import http from "http";
import FS from "fs";
import Path from "path";
import CONST from "./constants.js";
import logger from "./setupLogger.js";

class Server {
    async init (path = CONST.PATH.ROUTES) {
        logger.verbose("Initialize Server");        
        this.app = Express();

        this.app.set(`views`, `www/linked`);
        this.app.set(`view engine`, `ejs`);
        
        await this.loadRoutes(path);
        return this;
    }

    start(port, ip = `0.0.0.0`) {
        this.server = http.createServer(this.app);
        this.server.listen(port, ip, () => {
            logger.log(`Listening on port ${port}`);
        });

        process.on(`SIGINT`, () => this.stop(this.server));
        process.on(`SIGTERM`, () => this.stop(this.server));
        return this;
    }

    stop () {
        logger.log(`Stopping server`);
        this.server.close();
        process.exit();
    }

    async loadRoutes(path = CONST.PATH.ROUTES) {
        logger.verbose(`routes path ${path} ${FS.existsSync(path)}`); 
        if (!FS.existsSync(path)) return;
        
        const contents = FS.readdirSync(path).sort();

        for (const entry of contents) {
            const fullpath = Path.join(process.cwd(), path, entry);
            logger.verbose(`route ${fullpath}`);     
            const { default: route } = await import(fullpath);
            this.app.use(route);   
        }        
    }
}

export default Server;
