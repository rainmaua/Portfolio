import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getAll,
});

/**
 * @swagger
 * /api/course/all:
 *  get:
 *      summary: Returns all courses
 *      description: Returns a list of all courses
 *      tags:
 *          - Courses
 *      responses:
 *          200:
 *              description: A list of all courses
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Course'
 *          
 */
async function getAll(req, res) {
    console.log("Getting all courses")
    const courses = await prisma.course.findMany()
    console.log("Get all courses succeeded.")
    return res.status(200).json(courses)
}