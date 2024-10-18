const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD  
    },
    tls: {
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false,
    }

});

function enviarEmail(to, subject, text=null, html = null, callback) {
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject
    };
    if(text!= null){
        mailOptions.text = text;
    }else if(html != null){
        mailOptions.html = html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("email enviado");
            if (callback && typeof callback === 'function') {
                callback();
            } 
        }
    });

}

module.exports = { enviarEmail };