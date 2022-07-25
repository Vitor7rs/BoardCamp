import { Router } from "express";
import { getCategories, insertCategory } from "../controllers/categoriesController.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import categorySchema from "../schemas/categorySchema.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", schemaValidator(categorySchema), insertCategory);

export default categoriesRouter; 