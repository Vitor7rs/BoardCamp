import { Router } from "express";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import gameSchema from "../schemas/gameSchema.js"
const gamesRouter = Router();

gamesRouter.get("/games");
gamesRouter.post("/games", schemaValidator(gameSchema));

export default gamesRouter;