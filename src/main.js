import Server from "./Server.js";
import CONST from "./constants.js";
import logger from "./setupLogger.js";

(async () => {
    const server = new Server();
    await server.init();        
    logger.log(`Data directory: ${CONST.DATA.ROOT}`);
    server.start(CONST.PORT);
})()
