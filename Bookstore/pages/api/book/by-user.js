import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getByUser,
});

/**
 * @swagger
 * /api/book/by-user?page={page}:
 *  get:
 *      summary: Returns books that the user is selling.
 *      description: Returns books that the user is selling. Uses the JWT token to identify the user.
 *      tags:
 *          - Books
 *      responses:
 *          200:
 *              description: Success. Returns a list of the books the user is selling.
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
async function getByUser(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    var pageNum = 1
    if (req.query["page"] != null) {
        pageNum = parseInt(req.query["page"])
    }

    console.log("Getting books of user: " + userId)
    const books = await prisma.book.findMany({
        where: {
            ownerId: userId,
            deleted: false
        },
        orderBy: {
            dateUpdated: 'desc'
        },
        skip: (pageNum - 1) * 20,
        take: 20
    })
    
    console.log("Get books of user succeeded.")
    return res.status(200).json(books)
}