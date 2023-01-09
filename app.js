const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const path = require("path");

const app = express();

// handlebars middle ware
app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars");

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static folder
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("contact", { layout: false });
});
app.post("/send", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>Name: ${req.body.company}</li>
  <li>Name: ${req.body.email}</li>
  <li>Name: ${req.body.phone}</li>
  </ul>
  <h3>message</h3>
  <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "samueloduba123@gmail.com",
        pass: "cflgyonxwpzyjpze",
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );

  let mailOptions = {
    from: "samueloduba123@gmail.com",
    to: "odubasamuel66@gmail.com",
    subject: "Sending Email using Node.js[nodemailer]",
    text: "That was easy!",
    html: output,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);

      res.render("contact", { msg: "Email has been sent" });
    }
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}... `);
});
