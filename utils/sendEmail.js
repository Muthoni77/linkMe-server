import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (recipientEmail) => {
  try {
    //create a transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "linkme685@gmail.com",
        pass: "rochfgehdndjpmpn",
      },
    });
    //send email using transport

    const response = await transporter.sendMail({
      from: "linkMe@gmail.com", // sender address
         to:[recipientEmail],
      //to: ["jbaraza46@gmail.com", "gloriamuthoni25@gmail.com"], // list of receivers
      subject: "Welcome to link me.", // Subject line
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Welcome to LinkMe!</title>
          <style>
          *{
            color:black;
          }
      
          p{
            font-size:14px;
          }
          </style>
      </head>
      <body>
          <table style="width: 100%; max-width: 600px; margin: 0 auto;  ">
          <tr>
            <td style="background-color: #e5dee7; text-align: center; padding: 20px;">
            <img src="https://img.analisa.io/instagram/post/295626336_1173493383511227_2108636260777547503_n.jpg" alt="SuperCart logo" style="width: 25%;">
            <h1>Welcome to Linkme!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
            <p><b>Dear ${name},</b></p>
            <p>Thank you for signing up for Linkme! We're thrilled to have you on board.</p>
            <p>Before you can start interacting with our social media, you need to activate your account. To do so, simply click the button below:</p>
            <center><p><a href="${process.env.EMAIL_VERIFICATION_LINK}/${token}" target="_blank" style="background-color: #008CBA; color: #fff; display: inline-block; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Activate Your Account</a></p></center>
            <p>Once your account is activated, you'll have access to a wide variety of products at great prices. Whether you're looking for electronics, home goods, or fashion, we've got you covered.</p>
            <p>If you have any questions or feedback, please don't hesitate to contact us. Our team is always happy to help.</p>
            <p>Thanks again for joining SuperCart! We look forward to serving you.</p>
            <p>Best regards,</p>
            <p>The Linkme Team</p>
            </td>
        </tr>
        </table>
      </body>
      </html>
`, // html body
    });

    console.log("response");
    console.log(response);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
