import express from "express";
import {getSignUp, userValidate, postSignUp} from "../controllers/signUpController.js";

const signUpRouter = express.Router();

signUpRouter.get("/", getSignUp);
signUpRouter.post("/", userValidate, postSignUp);

export default signUpRouter;