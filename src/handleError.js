import logger from "./setupLogger.js";
import CONST from "./constants.js";

function handleError(err, route, res) {
    logger.log(new Date().toLocaleString());
    logger.log(route);
    logger.log(err);
    res.json({
        status: CONST.STATUS.ERROR,
        route: route,
        message: err.message
    });
}

export default handleError;