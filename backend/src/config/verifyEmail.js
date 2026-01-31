import nodemailer from "nodemailer";

export const Verifymail = async (token, email) => {
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass,
      },
    });

    const mailConfigurations = {
    from: process.env.mailUser,
    to: email,
    subject: "Email Verification",
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:9001/auth/verify?token=${token} 
           Thanks`
  };

   transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error);
    }
    console.log("Email Sent Successfully");
   
  });
 
};