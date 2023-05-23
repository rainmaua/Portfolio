import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getById,
});

/**
 * @swagger
 * /api/book/by-id?id={id}:
 *  get:
 *      summary: Returns book by ID
 *      description: Returns a book matching the UUID. Match is exact.
 *      tags:
 *          - Books
 *      parameters:
 *          - in: query
 *            name: id
 *            type: string
 *            description: The UUID for the book.
 *      responses:
 *          200:
 *              description: Success. A single book matching the UUID.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          
 */
async function getById(req, res) {
    console.log("Getting book by id: " + req.query["id"].toString())

    const book = await prisma.book.findUniqueOrThrow({
        where: {
            id: req.query["id"].toString()
        }
    })
    console.log("Book found: ")
    console.log(book)
    return res.status(200).json(book)
}