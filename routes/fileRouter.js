import express from "express";
import {getFileUpload, postFileUpload, getFilesFromFolder} from "../controllers/fileUploadController.js";
import {ensureAuthenticated} from "../middleware/auth.js";
import {upload} from "../middleware/multer.js";

const fileRouter = express.Router();

fileRouter.get("/:folderId/files", getFilesFromFolder);
fileRouter.get("/:folderId", ensureAuthenticated, getFileUpload);
fileRouter.post("/:folderId", upload.single("file"), postFileUpload);


export default fileRouter;