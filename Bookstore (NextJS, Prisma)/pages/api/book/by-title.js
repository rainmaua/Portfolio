import { prisma } from "../../../db";
import { apiHandler } from "../../../helpers/api/api-handler";

export default apiHandler({
    get: getByTitle,
});

/**
 * @swagger
 * /api/book/by-title?title={title}?page={page}:
 *  get:
 *      summary: Returns books matching the title.
 *      description: Returns books starting with the title query.
 *      tags:
 *          - Books
 *      parameters:
 *          - in: query
 *            name: title
 *            type: string
 *            description: The book title query.
 *      responses:
 *          200:
 *              description: hello world
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                            $ref: '#/components/schemas/Book'
 *          
 */
async function getByTitle(req, res) {
    console.log("Getting books with title: " + req.query["title"]);

    var pageNum = 1
    if (req.query["page"] != null) {
        pageNum = parseInt(req.query["page"])
    }

    const books = await prisma.book.findMany({
        where: {
            title: {
                contains: req.query["title"],
                mode: "insensitive",
            },
            sold: false,
            deleted: false
        },
        skip: (pageNum - 1) * 20,
        take: 20
    });
    console.log("Get books by name succeeded.");
    return res.status(200).json(books);
}
