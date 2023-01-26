function getArg(id, req, msg) {
    console.log(req.body);
    console.log(req.query);

    msg = msg || `missing argument '${id}'`;
    if (!req.body) throw new Error(msg);    
    
    const arg = req.body[id] || req.query[id];
    if (!arg) throw new Error(msg);    
    return arg;
}

export default getArg;