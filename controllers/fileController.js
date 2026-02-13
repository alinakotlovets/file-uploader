import {addFileInfoToDb, getFilesByFolder, getFileById, getShareByToken} from "../lib/queries.js";
import cloudinary from "../middleware/cloudinary.js";
import axios from "axios";
export function getFileUpload(req, res){
    const {folderId} = req.params;
    res.render("fileUpload", {errors: [], folderId: folderId});
}



export async function postFileUpload(req, res){
    try {
        const { folderId } = req.params;

        if(!req.file) throw new Error("File is required");
        if(!folderId) throw new Error("Folder dont exist");

        const base64Str = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Str, {
            folder: "fileUploader",
            resource_type: "raw",
            public_id: Buffer.from(req.file.originalname, 'latin1').toString('utf8').replace(/\.[^/.]+$/, "")
        });


        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        const path = result.secure_url;
        await addFileInfoToDb(originalName, path, req.file.mimetype, req.file.size, req.user.id, parseInt(folderId));

        res.redirect("/");
    } catch(err) {
        res.status(400).render("fileUpload", { errors: [ { msg: err.message } ], folderId: req.params.folderId });
    }
}

export async function getFilesFromFolder(req, res){
    const {folderId} =req.params;
    if(!folderId){
        return res.status(400).json({error: "folder dont exist", folderId: folderId})
    }
    const files= await getFilesByFolder(parseInt(folderId));
    return res.status(200).json({files: files});
}

export async function getFileDetail(req,res){
    const {fileId} = req.params
    const file = await getFileById(parseInt(fileId));

    const formatedDateFile = {
        ...file,
        formattedDate: new Intl.DateTimeFormat("uk-UA", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(file.addedAt))
    };

    res.render("fileDetail", {file: formatedDateFile});
}

export async function downloadFile(req, res) {
    const { fileId } = req.params;
    const file = await getFileById(parseInt(fileId));
    if(!file) return res.status(404).send("File not found");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`
    );
    res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
    const response = await axios.get(file.path, { responseType: 'stream' });
    response.data.pipe(res);
}


export async function getShareDetailPage(req, res){
    const {token, fileId} = req.params;
    if(!token){
        res.status(404).json({
            message: "Share link not found"
        })
    }
    const share= await  getShareByToken(token);
    const date = new Date();

    if(share.expiresAt < date){
        return res.status(403).json({
            message: "Share link is expired"
        })
    }

    if(!fileId){
        res.status(404).json({
            message: "File not found"
        })
    }

    const file = await getFileById(parseInt(fileId));

    const formatedDateFile = {
        ...file,
        formattedDate: new Intl.DateTimeFormat("uk-UA", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(file.addedAt))
    };

    res.render("fileDetail", {file: formatedDateFile});
}