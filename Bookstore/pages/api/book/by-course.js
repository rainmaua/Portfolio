import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getByCourse,
});

/**
 *  @swagger
 *  /api/book/by-course?course={course}?page={page}:
 *  get:
 *      summary: Search books by course
 *      description: Returns a list of books matching the passed course ID
 *      tags:
 *          - Books
 *      parameters:
 *          - in: query
 *            name: course
 *            type: string
 *            description: The course UUID for the book.
 *      responses:
 *          200:
 *              description: hello world
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 */
async function getByCourse(req, res) {
    console.log("Getting books with course ID: " + req.query["course"])

    var pageNum = 1
    if (req.query["page"] != null) {
        pageNum = parseInt(req.query["page"])
    }

    const books = await prisma.book.findMany({
        where: {
            courseId: req.query["course"],
            sold: false,
            deleted: false
        },
        skip: (pageNum - 1) * 20,
        take: 20
    })
    console.log("Get books by course succeeded.")
    return res.status(200).json(books)
}