const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer")
require("dotenv").config()

app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.post("/send_mail", async (req, res) => {
	let { email, number, address } = req.body
	const transport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		}
	})

	await transport.sendMail({
		from: process.env.GMAIL_USER,
		to: email,
		subject: "test email",
		html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>Please verify that the information below is correct!</h2>
        <p><strong>Email:</strong> ${email}</p>
		<p><strong>Phone number:</strong> ${number}</p>
		<p><strong>Address:</strong> ${address}</p>
    
        <p>All the best, Shadman</p>
         </div>
    `
	})
})

app.listen(
	5000,
	() => {
		console.log("Server is listening on port 5000")
	})