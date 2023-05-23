import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';
import { checkUser } from '../../../helpers/api/check-user';

export default apiHandler({
    post: add,
    put: update,
    delete: _delete
});

/**
 *  @swagger
 *  /api/course:
 *  post:
 *      summary: Adds a new course
 *      description: Adds a new course.
 *      tags:
 *          - Cart
 *      responses:
 *          200:
 *              description: Success. Returns the newly created course
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Course'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function add(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }

    console.log("Creating new course...")
    const new_course = await prisma.course.create({
        data: {
            name: req.body["name"],
            university: req.body["university"]
        }
    })
    console.log("Created new course: ")
    console.log(new_course)
    res.status(201).json(new_course)
}

/**
 *  @swagger
 *  /api/course:
 *  put:
 *      summary: Updates a course
 *      description: Updates a course.
 *      tags:
 *          - Cart
 *      responses:
 *          200:
 *              description: Success. Returns the newly created course
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Course'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function update(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }

    console.log("Updating course with id " + req.query["id"].toString())
    const updated_course = await prisma.course.update({
        where: {
            id: req.query["id"].toString()
        },
        data: {
            name: req.body["name"],
            university: req.body["university"]
        }
    })
    console.log("Course updated: ")
    console.log(updated_course)
    res.status(200).json(updated_course)
}

/**
 *  @swagger
 *  /api/course?id={courseId}:
 *  put:
 *      summary: Delete a course
 *      description: Deletes a course.
 *      tags:
 *          - Cart
 *      responses:
 *          200:
 *              description: Success. Returns an empty json.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Empty'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function _delete(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }
    
    console.log("Deleting course with id " + req.query["id"].toString())
    const deleted_course = await prisma.course.delete({
        where: {
            id: req.query["id"].toString()
        }
    })
    console.log("Course deleted: ")
    console.log(deleted_course)
    res.status(204).json()
}