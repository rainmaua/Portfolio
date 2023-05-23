import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';


export default apiHandler({
    get: search,
});

/**
 * @swagger
 * /api/course/by-name?course={courseName}&university={universityName}:
 *  get:
 *      summary: Returns courses matching course and university name
 *      description: Returns courses matching the course name and university name. Matches based on starting with
 *      tags:
 *          - Courses
 *      responses:
 *          200:
 *              description: Success. A list of matching courses.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Course'
 *          
 */
async function search(req, res) {
    console.log("Getting course by name " + req.query["course"] + " and university " + req.query["university"])
    const courses = await prisma.course.findMany({
        where: {
            name: {
                startsWith: req.query["course"]
            },
            university: {
                startsWith: req.query["university"]
            }
        }
    })
    console.log("Courses found: ")
    console.log(courses)
    res.status(200).json(courses)
}