import express from "express";
import multer from "multer";
import FS from "fs";
import Path from "path";

const router = express.Router();

router.post("/multipart-file",
    log,
    multer({ dest: 'uploads/' }).single('fileupload'),
    moveFile
);

function log(req, res, next) {
    console.log(req.method + ` ` + req.originalUrl);
    next();
}

function moveFile(req, res, next) {
    FS.renameSync(req.file.path, Path.join("uploads", req.file.originalname));
}

export default router;
