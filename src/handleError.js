import logger from "./setupLogger.js";
import CONST from "./constants.js";

function handleError(err, route, req, res) {
    res.set('Content-Type', 'application/json');
    logger.log(req.mldsp.hash + ' ' + err);
    const msg = JSON.stringify({
        status: CONST.STATUS.ERROR,
        route: route,
        message: err.message
    }, null, 2);
    res.write(msg);
}

export default handleError;