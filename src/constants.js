const CONSTANTS = {
    URL: {
        CREATE_JOB: "/create_job",
        GET_JOB_RECORD: "/get_job_record",
        LIST_JOBS: "/list_jobs",
        DELETE_JOB: "/delete_job",

        LIST_DATASETS: "/list_datasets",
        SUBMIT_CALCULATION: "/submit_calculation",
        GET_JOBS: "/get_jobs",
        GET_RESULTS: "/get_results",
        REMOVE_RESULT: "/remove_result",
        UPLOAD_DATASET: "/upload-dataset"
    },
    PATH: {
        ROUTES : "./src/routes"
    },
    DATA: {
        USER: "./data/user/",
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
