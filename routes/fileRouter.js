import express from "express";
import {getFileUpload, postFileUpload, getFilesFromFolder, getFileDetail} from "../controllers/fileUploadController.js";
import {ensureAuthenticated} from "../middleware/auth.js";
import {upload} from "../middleware/multer.js";

const fileRouter = express.Router();

fileRouter.get("/upload-file/:folderId", ensureAuthenticated, getFileUpload);
fileRouter.post("/upload-file/:folderId", upload.single("file"), postFileUpload);
fileRouter.get("/:fileId", ensureAuthenticated, getFileDetail);
fileRouter.get("/:folderId/files", getFilesFromFolder);


export default fileRouter;