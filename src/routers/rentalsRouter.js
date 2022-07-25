import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import rentalSchema from "../schemas/rentalSchema.js"

const rentalsRouter = Router();

rentalsRouter.get("/rentals"); 
rentalsRouter.post("/rentals", schemaValidator(rentalSchema)); 
rentalsRouter.post("/rentals/:id/return");
rentalsRouter.delete("/rentals/:id");

export default rentalsRouter;