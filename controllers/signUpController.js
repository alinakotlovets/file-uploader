import bcrypt from "bcryptjs"
import {addUserToBd} from "../lib/queries.js";
import {body, validationResult, matchedData} from "express-validator";

export const userValidate = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 2, max:50}).withMessage("First name must have at least 2 letter and no more than 50 letter"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password must be not empty")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .isLength({min: 8}).withMessage("Password must have at least 8 symbols"),
    body("confirmPassword")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
]
export function getSignUp(req,res){
    res.render("signUp", {errors: [],username: "", password:"", confirmPassword:""});
}

export async function postSignUp(req,res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("signUp", {
            errors: errors.array(),
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
    }

    const {username, password, confirmPassword} = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUserToBd(username, hashedPassword);
    res.redirect("/sign-in");
}