const nodemailer = require("nodemailer");
module.exports.sendEmail = (email, msg) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
      },
    });
    console.log(msg);

    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Varification",
      html: `<div>to verify click <a href="http://127.0.0.1:5500/frontend/verify.html?q=${msg}">here</a></div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // resolve({err:error,status:false})
        reject(new Error("email is not send"));
      } else {
        resolve({
          info: info.response,
          status: true,
          msg: msg,
        });
      }
    });
  });
};


//email encryption

module.exports.encrypt = (text) => {
  return Buffer.from(text).toString("hex");
};

module.exports.decrypt = (text) => {
  return Buffer.from(text, "hex").toString();
};
