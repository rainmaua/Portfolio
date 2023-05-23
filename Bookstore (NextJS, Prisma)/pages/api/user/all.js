import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getAll,
});

/**
 * @swagger
 * /api/user/all:
 *  get:
 *      summary: Returns a list of all users
 *      description: Returns a list of all users
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Returns a list of all users.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 * 
 */
async function getAll(req, res) {
    console.log("Getting all users")
    const users = await prisma.user.findMany()
    console.log("Get all users succeeded.")
    return res.status(200).json(users)
}