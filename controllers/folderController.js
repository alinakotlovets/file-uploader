import {addFolderToBd, deleteFolderById, updateFolderInBd} from "../lib/queries.js";


export async function postFolder(req, res){
    const folderName = req.body.folderName;
    const userId = req.user.id;
    if(!folderName){
        return res.status(400).json({
            message: "Folder name is required"
        });
    }
    const newFolder = await addFolderToBd(folderName, userId)
    return res.status(200).json({
        folder: newFolder
    });
}


export async function deleteFolder(req,res){
    const {folderId} = req.params;

    if(!folderId){
        return res.status(400).json({
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
        return res.status(400).json({
            message: "Folder id not found"
        });
    }

    if(!folderName){
        return res.status(400).json({
            message: "Folder name required"
        });
    }
    const updatedFolder = await updateFolderInBd(parseInt(folderId), folderName);
    return res.status(200).json({ folder: updatedFolder });
}