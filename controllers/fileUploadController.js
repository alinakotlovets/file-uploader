import {addFileInfoToDb, getFilesByFolder} from "../lib/queries.js";
export function getFileUpload(req, res){
    const {folderId} = req.params;
    res.render("fileUpload", {errors: [], folderId: folderId});
}

export async function postFileUpload(req, res){
    const {folderId} = req.params;
    if (!req.file) {
        return res.status(400).render("fileUpload", {errors: ["file dont exist"], folderId: folderId})
    }
    if(!folderId){
        return res.status(400).render("fileUpload", {errors: ["folder dont exist"], folderId: folderId})
    }
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    await addFileInfoToDb(originalName, req.file.path, req.file.size, req.user.id, parseInt(folderId));
    res.redirect("/");
}

export async function getFilesFromFolder(req, res){
    const {folderId} =req.params;
    if(!folderId){
        return res.status(400).json({error: "folder dont exist", folderId: folderId})
    }
    const files= await getFilesByFolder(parseInt(folderId));
    return res.status(200).json({files: files});
}