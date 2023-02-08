import CONST from "./constants.js";
import logger from "./setupLogger.js";

function handleError(res, url, err, obj = {}) {
    res.set('Content-Type', 'application/json');

    console.log(err, err.message);

    const msg = JSON.stringify({
        status: CONST.STATUS.ERROR,
        url: url,
        message: err.message,
        ...obj
    }, null, 2);

    logger.veryverbose(`error-response: ${msg}`);
    res.write(msg);
}

export default handleError;