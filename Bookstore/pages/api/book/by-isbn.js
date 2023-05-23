import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getByIsbn,
});

/**
 * @swagger
 * /api/book/by-isbn?isbn={isbn}?page={page}:
 *  get:
 *      summary: Searches for books by ISBN
 *      description: Returns books with ISBN starting with the query
 *      tags:
 *          - Books
 *      parameters:
 *          - in: query
 *            name: isbn
 *            type: string
 *            description: The ISBN query.
 *      responses:
 *          200:
 *              description: Success. A list of books with ISBN starting with the query.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/Book'
 *          
 */
async function getByIsbn(req, res) {
    console.log("Getting books with isbn: " + req.query["isbn"])

    var pageNum = 1
    if (req.query["page"] != null) {
        pageNum = parseInt(req.query["page"])
    }

    const books = await prisma.book.findMany({
        where: {
            isbn: {
                startsWith: req.query["isbn"],
                mode: "insensitive"
            },
            sold: false,
            deleted: false
        },
        skip: (pageNum - 1) * 20,
        take: 20
    })
    console.log("Get books by isbn succeeded.")
    return res.status(200).json(books)
}