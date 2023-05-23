import getConfig from 'next/config';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { serverRuntimeConfig } = getConfig();

export default apiHandler({
    post: authenticate
});

/**
 * @swagger
 * /api/user/authenticate:
 *  get:
 *      summary: Authenticates a user's username and password.
 *      description: Authenticates a user's username and passwords; logs them in. Includes the jwt token that should be included in the authorization header for calling protected routes
 *      tags:
 *          - Users
 *      parameters:
 *          - in: body
 *            name: username
 *            type: string
 *            description: The username of the user
 *          - in: body
 *            name: password
 *            type: string
 *            description: The password of the user
 *      responses:
 *          200:
 *              description: Returns some user info and a valid jwt token.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/AuthenticatedUser'
 * 
 */
async function authenticate(req, res) {
    const username = req.body["username"]
    const password = req.body["password"]
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            username: username
        }
    })

    // validate
    if (!(user && bcrypt.compareSync(password, user.password))) {
        throw 'Username or password is incorrect';
    }

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        verified: user.verified,
        token
    });
}