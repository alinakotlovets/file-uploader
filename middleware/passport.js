import bcrypt from "bcryptjs"
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import {getUserById, getUserByUsername} from "../lib/queries.js";
export function initializePassport(){
    passport.use(new LocalStrategy(async (username, password, done)=>{
        try {
            const user = await getUserByUsername(username);
            if (!user) {
                return done(null, false, {message: "Incorrect username"});
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, {message: "Incorrect password"})
            }
            return done(null, user);
        }
        catch (err){
            return done(err);
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done)=>{
        try {
            const user = await getUserById(id);
            done(null, user);

        } catch (err) {
            done(err);
        }
    })
    return passport;
}