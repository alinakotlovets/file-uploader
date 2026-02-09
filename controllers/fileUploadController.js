import {addFileInfoToDb} from "../lib/queries.js";
export function getFileUpload(req, res){
    res.render("fileUpload", {errors: []});
}

export async function postFileUpload(req, res){
        if (!req.file) {
            return res.status(400).render("fileUpload", {errors: ["file dont exist"]})
        }

        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        await addFileInfoToDb(originalName, req.file.path, req.file.size, req.user.id);
    res.redirect("/");
}