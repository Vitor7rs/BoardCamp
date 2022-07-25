import { Router } from "express";
import { getGames, insertGame } from "../controllers/gamesController.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import gameSchema from "../schemas/gameSchema.js"
const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", schemaValidator(gameSchema), insertGame);

export default gamesRouter; 