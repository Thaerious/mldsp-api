const CONSTANTS = {
    URL: {
        CREATE_JOB: "/create_job",
        GET_JOB_RECORD: "/get_job_record",
        LIST_JOBS: "/list_jobs",
        DELETE_JOB: "/delete_job",
        UPLOAD_DATA: "/upload_data",
        START_JOB: "/start_job",
        SET_VALUE: "/set_value",
        ALL_JOBS: "/all_jobs"
    },
    PATH: {
        ROUTES : "./src/routes"
    },
    DATA: {
        ROOT: "./data/user/",
        DATA_SUB: "data",
        RESULTS_SUB: "results",
        RECORD_FILENAME: "record.json"
    },   
    STATUS: {
        ERROR: "error",
        OK: "ok",
        PENDING: "pending",
        COMPLETE: "complete",
    },    
};

export default CONSTANTS;
