const { appendFile } = require("fs");
const nodemailer = require("nodemailer")

const sendEmail = async (subject, message, send_to, send_from, reply_to) => {
    // which service to use to send the email : transporter's job
    const transporter = nodemailer.createTransport({
        service: "gmail", 
        // port: "587",
        auth: {
            user: "test.yiryoung@gmail.com",
            pass: "znfiothyyyukscef"
        }, 
        // tls:{
        //     rejectUnauthorized: false, 
        // }
    })

    let mailOptions = {
        from: "test.yiryoung@gmail.com",
        to:"rainmaua@gmail.com",
        subject: "Testing",
        text:"First email sent from Nodejs using Nodemailer"
    }; 

    transporter.sendMail(mailOptions, function(error, success){
        if (error) {
            console.log(err)
        }
        else {
            console.log("Email sent sucessfully")
        }
    }); 

    
};