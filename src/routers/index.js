import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";

const router = Router();

//routes
router.use(categoriesRouter);
//router.use();
//router.use();

export default router;