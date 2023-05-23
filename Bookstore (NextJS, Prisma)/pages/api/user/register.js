import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

export default apiHandler({
    post: register
})

/**
 * @swagger
 * /api/user/register:
 *  post:
 *      summary: Registers a new user.
 *      description: Register a new user. Cannot use username and email already in use. /user/authenticate should be called to log in.
 *      tags:
 *          - Users
 *      responses:
 *          204:
 *              description: Success. Returns the new user.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/User'
 * 
 */
async function register(req, res) {
    console.log("Creating new user...")
    const hash = bcrypt.hashSync(req.body["password"], 10)
    var code = "0000000" + Math.floor(Math.random() * 999999)
    code = code.substring(code.length-6)
    const codeHash = bcrypt.hashSync(code, 10)

    const new_user = await prisma.user.create({
        data: {
            username: req.body["username"],
            password: hash,
            firstName: req.body["first_name"],
            lastName: req.body["last_name"],
            email: req.body["email"],
            phoneNum: req.body["phone_num"],
            code: codeHash
        }
    })

    console.log("New user created: ")
    console.log(new_user)

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
    console.log("Verification email sent")
    
    res.status(201).json(new_user)
}