import { prisma } from './prisma.js';


export async function getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

export async function addUserToBd(username, password){
    return prisma.user.create({data: { username, password }})
}

export async function addFileInfoToDb(originalName, path, size, userId, folderId){
    return prisma.files.create({
        data: {
            fileName: originalName,
            path: path,
            size: size,
            userId: userId,
            folderId: folderId
        }
    })
}

export async function addFolderToBd(folderName, userId){
    return prisma.folder.create({
        data: {
            folderName: folderName,
            userId: userId
        }
    })
}

export async function getUserFolders(userId){
    return prisma.folder.findMany({
        where: { userId: userId },
        orderBy: { addedAt: 'desc' }
    });
}

export async function deleteFolderById(folderId){
    return prisma.folder.delete({
        where: {
            id: folderId
        }
    })
}

export async function updateFolderInBd(folderId, folderName){
    return prisma.folder.update({
        where: { id: folderId },
        data: {folderName: folderName}
    })
}

export async function getFilesByFolder(folderId){
    return prisma.files.findMany({
        where: { folderId: folderId },
        orderBy: { addedAt: 'desc' }
    })
}

export async function getFileById(fileId) {
    return prisma.files.findUnique({
        where: { id: fileId },
        include: {
            user: {
                select: {
                    username: true
                }
            },
            folder: {
                select: {
                    folderName: true
                }
            }
        }
    });
}
