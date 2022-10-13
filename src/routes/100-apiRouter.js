import Express from "express";
import bodyParser from "body-parser";

const apiRouter = Express.Router();

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: false }));

export default apiRouter;