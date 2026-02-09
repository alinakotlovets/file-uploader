import express from "express";
import {getFileUpload, postFileUpload} from "../controllers/fileUploadController.js";
import {ensureAuthenticated} from "../middleware/auth.js";
import {upload} from "../middleware/multer.js";

const fileUploadRouter = express.Router();

fileUploadRouter.get("/", ensureAuthenticated, getFileUpload);
fileUploadRouter.post("/", upload.single("file"), postFileUpload);

export default fileUploadRouter;