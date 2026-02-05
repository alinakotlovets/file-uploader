import express from "express";
import {getIndex, logOut} from "../controllers/indexController.js";
import {ensureAuthenticated} from "../middleware/auth.js";

const indexRouter = express.Router();

indexRouter.get("/", ensureAuthenticated, getIndex);
indexRouter.get("/log-out", logOut);
export default indexRouter;
