import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

export default apiHandler({
    post: verify
})

async function verify(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    const code = req.body["code"]
    console.log("Verifying email of user " + userId)

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    if (!(user && bcrypt.compareSync(code, user.code))) {
        throw 'Email verification code is incorrect';
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            verified: true
        }
    })
    console.log("Email has been verified")
    return res.status(200).json({})
}