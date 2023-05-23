import { prisma } from "../../../db";
import { apiHandler } from "../../../helpers/api/api-handler";

export default apiHandler({
    get: getAll,
});

/**
 * @swagger
 * /api/book/all?page={page}:
 *  get:
 *      summary: Returns books, 20 at a time
 *      description: Returns a list of unsold books, 20 at a time. Use page for pagination.
 *      tags:
 *          - Books
 *      responses:
 *          200:
 *              description: A list of 20 or less books
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 */
async function getAll(req, res) {
    console.log("Getting all books");
    
    var pageNum = 1
    if (req.query["page"] != null) {
        pageNum = parseInt(req.query["page"])
    }
    
    const books = await prisma.book.findMany({
        where: {
            sold: false,
            deleted: false
        },
        skip: (pageNum - 1) * 20,
        take: 20
    });
    console.log("Get all books succeeded.");
    return res.status(200).json(books);
}