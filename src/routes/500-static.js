import express from "express";
const router = express.Router();

router.use("/index", (req, res, next) => res.redirect("/index.html"));

router.use(express.static(`www`));
export default router;