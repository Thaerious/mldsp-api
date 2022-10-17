import logger from "./setupLogger.js";
import CONST from "./constants.js";

function handleError(err, route, res) {
    logger.log(new Date().toLocaleString());
    logger.log(route);
    logger.log(err);
    const msg = JSON.stringify({
        status: CONST.STATUS.ERROR,
        route: route,
        message: err.message
    }, null, 2);
    res.write(msg);
}

export default handleError;