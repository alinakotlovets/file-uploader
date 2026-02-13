import express from "express";
import {postFolder, deleteFolder, updateFolder, postShareLink, getSharePage} from "../controllers/folderController.js";

const folderRouter = express.Router();

folderRouter.get("/share/:token",getSharePage);
folderRouter.post("/share", postShareLink)
folderRouter.post("/", postFolder);
folderRouter.delete("/:folderId", deleteFolder);
folderRouter.put("/:folderId", updateFolder);
export default folderRouter;