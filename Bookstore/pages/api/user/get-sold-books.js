import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getSoldBooks,
});
/**
 * @swagger
 * /api/user/get-sold-books?page={page}:
 *  get:
 *      summary: Returns books that the user has sold
 *      description: Returns books that the user has sold. Uses the JWT token to identify the user.
 *      tags:
 *          - Books
 *      responses:
 *          200:
 *              description: Success. Returns a list of the sold the user has bought.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 */
async function getSoldBooks(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    const soldBooks = await prisma.Transaction.findMany({
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
        }
    })

    return res.status(200).json(soldBooks);
}