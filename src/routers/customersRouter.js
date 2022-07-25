import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import customerSchema from "../schemas/customerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers" );
customersRouter.get("/customers/:id");
customersRouter.post("/customers", schemaValidator(customerSchema));
customersRouter.put("/customers", schemaValidator(customerSchema));

export default customersRouter;