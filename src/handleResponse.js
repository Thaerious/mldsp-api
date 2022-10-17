import CONST from "./constants.js";

function handleResponse(res, route, obj = {}) {
    const msg = JSON.stringify({
        status: CONST.STATUS.OK,
        route: route,
        ...obj
    });

    res.write(msg);
}

export default handleResponse;