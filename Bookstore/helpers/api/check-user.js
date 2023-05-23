export {checkUser};
import { prisma } from '../../db'

async function checkUser(userId) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    return user.suspended
}