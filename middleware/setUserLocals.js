export default function setUserLocals(req, res, next){
    if (req.user) {
        const {password, ...safeUser} = req.user;
        res.locals.user = safeUser;
    } else {
        res.locals.user = null;
    }
    next();
}