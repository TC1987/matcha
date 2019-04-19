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
    mailOptions.to = 'matcha.42.us+4@gmail.com';
    mailOptions.html = `<p>Hey ${user.firstname}, congrats on signing
    up for Matcha! All that's left is
    <a href="http://localhost:8000/api/users/verify/${user._id}">clicking this link</a>
    to verify your email and then you'll be ready to go off and find sexy singles in your area!</p>`;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success: email verification has been sent');
    });
};