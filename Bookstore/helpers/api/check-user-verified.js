export {checkUserVerified};
import { prisma } from '../../db'

async function checkUserVerified(userId) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    return user.verified
}