import express from "express";
import {postFolder} from "../controllers/folderController.js";

const folderRouter = express.Router();

folderRouter.post("/", postFolder);

export default folderRouter;