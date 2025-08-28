const nodemailer = require("nodemailer");
const pug = require("pug");
const {convert} = require("html-to-text");

// new Email(user, url).sendWelcome();

module.exports = class Emal {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(" ")[0];
        this.url = url;
        this.from = `Makanjuola Emmanuel <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Sendgrid
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

   async send(template, subject) {
        // Send the actual email
        // 1) Render the HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });
        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
       
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!");
    }

}

// const sendEmail = async options => {


//     // 2) Define the email options
//     const mailOptions = {
//         from: "Jonas Schmedtmann <jonas@jonnas.io>",
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     };

//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Email sent: " + info.response);
//         }
//     });
// }

