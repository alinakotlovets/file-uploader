import express from "express";
import {getFileUpload, postFileUpload, getFilesFromFolder, getFileDetail, downloadFile, getShareDetailPage} from "../controllers/fileController.js";
import {ensureAuthenticated} from "../middleware/auth.js";
import {upload} from "../middleware/multer.js";
import {validateFile} from "../middleware/validateFile.js";
import {isFileAddedByUser} from "../middleware/fileDetailPermission.js";

const fileRouter = express.Router();

fileRouter.get("/share/:token/:fileId", getShareDetailPage);
fileRouter.get("/share/:token/:fileId/download", downloadFile);
fileRouter.get("/upload-file/:folderId", ensureAuthenticated, getFileUpload);
fileRouter.post("/upload-file/:folderId", upload.single("file"), validateFile, postFileUpload);
fileRouter.get("/:fileId/download",  ensureAuthenticated, downloadFile);
fileRouter.get("/:fileId", ensureAuthenticated, isFileAddedByUser, getFileDetail);
fileRouter.get("/:folderId/files", getFilesFromFolder);



export default fileRouter;