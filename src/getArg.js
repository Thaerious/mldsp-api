function getArg(id, req, msg) {
    msg = msg || `missing argument '${id}'`;

    const arg = req.body[id] || req.query[id];
    if (!arg) throw new Error(msg);    
    return arg;
}

export default getArg;