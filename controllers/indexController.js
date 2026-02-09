import {getUserFolders} from "../lib/queries.js";


export async function getIndex(req, res){
    const folders = await getUserFolders(req.user.id);
    res.render("index", {folders: folders})
}

export function logOut(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/sign-in");
    });
}