import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';


export default apiHandler({
    get: getAll,
});

/**
 *  @swagger
 *  /api/buy-request/get-received:
 *  get:
 *      summary: Gets all buy requests received by the user.
 *      description: Gets all buy requests received by the user, identified by the jwt token.  For these buy requests, the current user is the seller.
 *      tags:
 *          - Buy Request
 *      responses:
 *          200:
 *              description: Success. Returns the list of buy requests received by the user.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/BuyRequest'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function getAll(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    console.log("Getting buy requests sent to user: " + userId)
    const buyReqs = await prisma.BuyRequest.findMany({
        where: {
            sellerId: userId
        },
        include: {
            book: true,
            buyer: {
                select: {
                    username: true
                }
            }
        },
        orderBy: {
            dateCreated: 'desc'
        }
    })
    
    console.log("Get buy requests sent to user succeeded.")
    return res.status(200).json(buyReqs)
}