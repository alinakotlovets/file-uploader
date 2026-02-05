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