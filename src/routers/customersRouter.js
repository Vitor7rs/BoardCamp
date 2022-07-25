import { Router } from "express";
import { getCustomer, getCustomers, insertCustomer, updateCustomer } from "../controllers/customersController.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import customerSchema from "../schemas/customerSchema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", schemaValidator(customerSchema), insertCustomer);
customersRouter.put("/customers", schemaValidator(customerSchema), updateCustomer);

export default customersRouter;