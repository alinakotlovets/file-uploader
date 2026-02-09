import {addFolderToBd} from "../lib/queries.js";


export async function postFolder(req, res){
    const folderName = req.body.folderName;
    const userId = req.user.id;
    if(!folderName){
        return res.status(400).json({
            message: "Folder name is required"
        });
    }
    await addFolderToBd(folderName, userId)

    return res.status(200).json({
        redirectTo: "/"
    });

}