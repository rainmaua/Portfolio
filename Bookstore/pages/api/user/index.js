import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

const bcrypt = require('bcryptjs');

export default apiHandler({
    get: getById,
    put: update,
    delete: _delete
});

/**
 * @swagger
 * /api/user?id={id}:
 *  get:
 *      summary: Gets user by id.
 *      description: Gets the user matching the UUID. If the sender matches the user, 
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Returns user info.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/User'
 * 
 */
async function getById(req, res) {
    console.log("Getting user by id: " + req.query["id"].toString())
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: req.query["id"].toString()
        }
    })
    console.log("Got user: ")
    console.log(user)
    return res.status(200).json(user)
}

/**
 * @swagger
 * /api/user:
 *  put:
 *      summary: Updates user info
 *      description: Updates user info.
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Returns the updated user.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/User'
 * 
 */
async function update(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    console.log("Updating user with id " + userId)
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            username: req.body["username"],
            firstName: req.body["first_name"],
            lastName: req.body["last_name"],
            email: req.body["email"],
            phoneNum: req.body["phone_num"]
        }
    })
    console.log("User updated: ")
    console.log(updatedUser)

    if (user.email != updatedUser.email) {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                verified: false
            }
        })
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "wubooks@zohomail.com",
                pass: "White_1122",
            },
        });
        // send mail with defined transport object
        var mailOptions = {
            from: "wubooks@zohomail.com",
            to: req.body["email"],
            subject: "WUBooks Email Verification",
            html: "Enter the following code on the verify email page under account to verify your email: " + code
        };

        await transporter.sendMail(mailOptions)
        console.log("New verification email sent")
    }

    return res.status(200).json(updatedUser)
}

/**
 * @swagger
 * /api/user:
 *  delete:
 *      summary: Deletes the user
 *      description: Deletes the user specified by the UUID
 *      tags:
 *          - Users
 *      responses:
 *          204:
 *              description: Success. Returns an empty json.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Empty'
 * 
 */
async function _delete(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    console.log("Deleting user with id " + userId)
    const deleted_user = await prisma.user.delete({
        where: {
            id: userId
        }
    })
    console.log("User deleted: ")
    console.log(deleted_user)
    res.status(204).json()
}