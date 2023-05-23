import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getBoughtBooks,
});
/**
 * @swagger
 * /api/user/get-bought-books?page={page}:
 *  get:
 *      summary: Returns books that the user has bought
 *      description: Returns books that the user has bought. Uses the JWT token to identify the user.
 *      tags:
 *          - Books
 *      responses:
 *          200:
 *              description: Success. Returns a list of the books the user has bought.
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
async function getBoughtBooks(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    const boughtBooks = await prisma.Transaction.findMany({
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
        }
    })

    return res.status(200).json(boughtBooks);
}