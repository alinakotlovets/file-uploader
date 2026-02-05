

export function getIndex(req, res){
    res.render("index");
}

export function logOut(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/sign-in");
    });
}