import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';
import { checkUser } from '../../../helpers/api/check-user';
import { checkUserVerified } from '../../../helpers/api/check-user-verified';

export default apiHandler({
    post: checkout
});

/**
 * @swagger
 * /api/user/checkout:
 *  post:
 *      summary: Checks out the user's cart.
 *      description: Checks out the user's cart, sending buy requests for all of them.
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Success. Returns an empty json
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Empty'
 * 
 */
async function checkout(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }
    if (await checkUserVerified(userId)) {
        return res.status(403).json({"message": "Please verify your email."})
    }

    console.log("Checking out the cart of user " + userId)
    // get user's cart
    const cart = await prisma.cart.findMany({
        where: {
            userId: userId
        },
        select: {
            book: true
        }
    })

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    // send a buy request for each book in cart
    for (let i = 0; i < cart.length; i++) {
        const buyReq = await prisma.User.update({
            where: {
                id: userId
            },
            data: {
                buying: {
                    create: {
                        sellerId: cart[i].book.ownerId,
                        bookId: cart[i].book.id,
                        content: "A user wants to buy your book! Their username is " + user.username
                    }
                }
            }
        })
    }

    // clear the cart
    console.log("Clearing cart")
    const clearCart = await prisma.cart.deleteMany({
        where: {
            userId: userId
        }
    })
    
    return res.status(200).json({})
}