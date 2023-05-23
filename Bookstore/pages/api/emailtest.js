import jwtDecode from 'jwt-decode';
import { prisma } from '../../db'
import { apiHandler } from '../../helpers/api/api-handler';
import { checkUser } from '../../helpers/api/check-user';

export default apiHandler({
    post: add
});

async function add(req, res) {


    return res.status(200).json({})
}







"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
}

main().catch(console.error);
