import express from "express";
import {postFolder, deleteFolder, updateFolder} from "../controllers/folderController.js";

const folderRouter = express.Router();

folderRouter.post("/", postFolder);
folderRouter.delete("/:folderId", deleteFolder);
folderRouter.put("/:folderId", updateFolder);
export default folderRouter;