import dotenv from "dotenv";
dotenv.config();

const CONSTANTS = {
    URLS: {
        CREATE_JOB: "/create_job",
        GET_JOB_RECORD: "/get_job_record",
        LIST_JOBS: "/list_jobs",
        DELETE_JOB: "/delete_job",
        UPLOAD_DATA: "/upload_data",
        START_JOB: "/start_job",
        SET_VALUE: "/set_value",
        ALL_JOBS: "/all_jobs",
        RETRIEVE_RESULTS: "/retrieve_results",
        STATUS: "/status"
    },
    PATH: {
        ROUTES: "./src/routes",
        MLDSP_EXE : "../venv/bin/MLDSP"
    },
    STATUS: {
        ERROR: "error",
        OK: "ok",
        PENDING: "pending",
        COMPLETE: "complete",
        RUNNING: "running"
    },
    DATA: {
        ROOT: `${process.env.DATA}`,  
        UPLOAD_TEMP : "temp",
        SUB: {
            USERS: 'users',
            DATA: "data",
            RESULT: "results",
            TEMP: "temp"
        },
        FILE: {
            RECORD: "record.json",
            RESULTS: "results.json"            
        }
    }
};

export default CONSTANTS;
