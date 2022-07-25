import { Router } from "express";
import { deleteRental, endRent, getRentals, insertRent } from "../controllers/rentalsController.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import rentalSchema from "../schemas/rentalSchema.js"

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals); 
rentalsRouter.post("/rentals", schemaValidator(rentalSchema), insertRent); 
rentalsRouter.post("/rentals/:id/return", endRent);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;