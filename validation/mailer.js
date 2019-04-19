const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'matcha.42.us@gmail.com',
        pass: 'Apples94555'
    }
});

let mailOptions = {
    from: 'matcha.42.us@gmail.com',
    subject: 'Matcha - Email Verification',
};

module.exports = (user) => {
    mailOptions.to = 'matcha.42.us+3@gmail.com';
    mailOptions.text = `Hey ${user.firstname}, congrats on signing
    up for Matcha! All that's left is clicking this llink to verify your email
    and you'll be off finding exciting singles in your area today!`;
    mailOptions.html = `<p>Hey ${user.firstname}, congrats on signing
    up for Matcha! All that's left is clicking this <a href="http://localhost:8000/api/users/verify/${user.regHash}">link to verify your email</a>
    and you'll be off finding exciting singles in your area today!</p>`;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success: email verification has been sent');
    });
};