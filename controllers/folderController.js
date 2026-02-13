import {
    addFolderToBd,
    addShareToBd,
    deleteFolderById,
    updateFolderInBd,
    getShareByToken,
    getFilesByFolder,
    getFolderByFolderId
} from "../lib/queries.js";

export async function postFolder(req, res){
    const folderName = req.body.folderName;
    const userId = req.user.id;
    if(!folderName){
        return res.status(400).json({
            message: "Folder name is required"
        });
    }
    if(folderName.length < 3 || folderName.length > 50){
        return res.status(400).json({
            message:"Folder should be at least 3 symbols and no more than 50 symbols"
        })
    }
    const newFolder = await addFolderToBd(folderName, userId)
    return res.status(200).json({
        folder: newFolder
    });
}


export async function deleteFolder(req,res){
    const {folderId} = req.params;

    if(!folderId){
        return res.status(404).json({
            message: "Folder id not found"
        });
    }

    await deleteFolderById(parseInt(folderId));
    return res.status(200).json({
        redirectTo: "/"
    });
}

export async function updateFolder(req, res){
    const {folderId} = req.params;
    const folderName = req.body.folderName;
    if(!folderId){
        return res.status(404).json({
            message: "Folder id not found"
        });
    }

    if(!folderName){
        return res.status(400).json({
            message: "Folder name required"
        });
    }

    if(folderName.length < 3 || folderName.length > 50){
        return res.status(400).json({
            message:"Folder should be at least 3 symbols and no more than 50 symbols"
        })
    }
    const updatedFolder = await updateFolderInBd(parseInt(folderId), folderName);
    return res.status(200).json({ folder: updatedFolder });
}

export async function postShareLink(req, res){
    const {folderId} = req.body;
    if(!folderId){
        return res.status(404).json({
            message: "Folder not found"
        })
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const token = crypto.randomUUID();
    await addShareToBd(token, expiresAt, parseInt(folderId));

    res.status(200).json({
        token: token
    })
}

export async function getSharePage(req, res){
    const {token} = req.params;
    if(!token){
        return res.status(404).json({
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

    const folder = await getFolderByFolderId(parseInt(share.folderId))
    const files = await getFilesByFolder(parseInt(share.folderId));
    res.render("sharedFolder", {folderName: folder.folderName, files: files, token:token})

}