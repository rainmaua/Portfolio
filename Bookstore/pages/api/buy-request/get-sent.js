import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';


export default apiHandler({
    get: getAll,
});

/**
 *  @swagger
 *  /api/buy-request/get-sent:
 *  get:
 *      summary: Gets all buy requests sent by the user.
 *      description: Gets all buy requests sent by the user, identified by the jwt token.  For these buy requests, the current user is the buyer.
 *      tags:
 *          - Buy Request
 *      responses: 
 *          200: 
 *              description: Success. Returns the list of buy requests sent by the user.
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
    console.log("Getting buy requests sent by user: " + userId)
    const buyReqs = await prisma.BuyRequest.findMany({
        where: {
            buyerId: userId
        },
        include: {
            book: true,
            seller: {
                select: {
                    username: true
                }
            }
        },
        orderBy: {
            dateCreated: 'desc'
        }
    })
    
    console.log("Get buy requests sent by user succeeded.")
    return res.status(200).json(buyReqs)
}