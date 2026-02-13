import {getUserIdOfFile} from "../lib/queries.js";

export async function isFileAddedByUser(req, res, next){
    const {fileId} = req.params;
    const data = await getUserIdOfFile(parseInt(fileId));

    if( !data || data.user.id  !== req.user.id){
        return res.redirect("/");
    }
    next()
}