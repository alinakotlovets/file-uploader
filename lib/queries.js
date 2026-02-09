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

export async function addFileInfoToDb(originalName, path, size, userId){
    return prisma.files.create({
        data: {
            fileName: originalName,
            path: path,
            size: size,
            userId: userId,
        }
    })
}

// export async function GetAllUserFiles(userId){
//     return prisma.files.findMany({
//         where: { userId: userId },
//         orderBy: { addedAt: 'desc' }
//     });
// }

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