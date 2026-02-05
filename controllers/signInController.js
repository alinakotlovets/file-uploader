import passport from "passport";
import {body, validationResult} from "express-validator";
export const userValidate = [
    body("username")
        .trim()
        .notEmpty().withMessage("User name must be not empty")
        .isLength({min: 4}).withMessage("Username must be at least 4 symbols"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password must be not empty")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .isLength({min: 8}).withMessage("Password must have at least 8 symbols"),
]
export function getSignIn(req,res){
    res.render("signIn", {errors: [], username:"", password:""})
}

export function postSignIn(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("signIn", {
            errors: errors.array(),
            username: req.body.username,
            password: req.body.password
        });
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            const errors = [];
            if (info && info.message) {
                errors.push({msg: info.message});
            }
            return res.status(400).render("signIn", {
                errors: errors,
                username: req.body.username,
                password: ""
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
}

