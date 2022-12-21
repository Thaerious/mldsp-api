// Monitors the status for this server.

const STATUS_VALUES = {
    IDLE : "idle",
    BUSY : "busy"
}

class Status {
    static instance = new Status();

    constructor() {
        this._status = STATUS_VALUES.IDLE;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

Status.VALUES = {
    IDLE: "idle",
    BUSY: "busy"
};

export default Status;