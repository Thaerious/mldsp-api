import Express from "express";
import multer from "multer";

const apiRouter = Express.Router();

apiRouter.use(
    multer({ dest: 'data/temp/' }).single('fileupload')
);

export default apiRouter;