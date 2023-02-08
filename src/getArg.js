function getArg(id, req, msg) {
    msg = msg || `missing argument '${id}'`;
    if (!req.body) throw new Error(msg);    
    
    const arg = req.body[id];
    if (arg === undefined) throw new Error(msg);    
    return arg;
}

export default getArg;