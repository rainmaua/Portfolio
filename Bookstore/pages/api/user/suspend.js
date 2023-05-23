import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    post: suspend
});

/**
 *  @swagger
 *  /api/buy-request/confirm-sale:
 *  post:
 *      summary: Suspends a user account
 *      description: Suspends a user account, preventing them from sending/receiving buy requests, creating new books, and confirming book sales.
 *      tags:
 *          - Buy Request
 *      responses:
 *          200:
 *              description: Success. Returns an empty json.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Empty'
 *          403:
 *              description: Sender is not an admin
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function suspend(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    if (!user.admin) {
        return res.statsu(403).json({"message": "Action forbidden. User is not admin."}) 
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: req.body["id"].toString()
        },
        data: {
            suspend: req.body["suspend"]
        }
    })

    return res.status(200).json({})
}