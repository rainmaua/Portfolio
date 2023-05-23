import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getById,
});

/**
 * @swagger
 * /api/course/by-id?id={courseId}:
 *  get:
 *      summary: Returns all courses
 *      description: Returns the course matching the UUID. Exact match.
 *      tags:
 *          - Courses
 *      responses:
 *          200:
 *              description: Success. Returns the course.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Course'
 *          
 */
async function getById(req, res) {
    console.log("Getting course by id: " + req.query["id"].toString())
    const course = await prisma.course.findUniqueOrThrow({
        where: {
            id: req.query["id"].toString()
        }
    })
    console.log("Course found: ")
    console.log(course)
    res.status(200).json(course)
}