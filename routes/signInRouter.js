import express from "express";
import {getSignIn, userValidate, postSignIn} from "../controllers/signInController.js";

const signInRouter = express.Router();

signInRouter.get("/", getSignIn);
signInRouter.post("/", userValidate, postSignIn)
export default signInRouter;