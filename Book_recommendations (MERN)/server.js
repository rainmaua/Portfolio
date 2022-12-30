const express = require('express');
const cors = require('cors');
// for nodeEmailer
const bodyParser = require('body-parser'); 
// const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer')
const path = require('path')
// 
const mongoose = require('mongoose');
const User = require('./models/user.model')
const Contact = require('./models/contact.model')
const jwt = require('jsonwebtoken')
// hashing algorithm: bcrypt 
const bcrypt = require('bcryptjs')
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;
const jwtTokenKey = process.env.TOKEN_KEY;
// view engine setup 
// app.engine('handlebars', exphbs.engine());
// app.set('view engine', 'handlebars');
// set static folder as our public folder
app.use('../public', express.static(path.join(__dirname, 'public')))
// body parser middleware 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// cors requried since it's cross-origin. i.e. we're using 2 localhosts
app.use(cors());
// to set req.'body' is json format
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri
);
const connection = mongoose.connection;
connection.once('open', () => {
	console.log("MongoDB database connection established successfully");
})

const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const { required } = require('yargs');

app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);


// app.get('/contacts', (req, res) => {
// 	// res.render('contact'); 
// 	res.send("HI")
// }); 



// REGISTER
app.post('/backend/register', async (req, res) => {
	console.log(req.body)
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10) // 10 = numCycles
		await User.create({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		})
		return res.json({ status: 'ok' })
	} catch (err) {
		console.log("Error: ", err)
		return res.json({ status: 'error', error: 'Duplicate email' })
	}
})

// LOGIN
app.post('/backend/login', async (req, res) => {
	console.log("server login backend  ")

	// to verify password, first find a user without a password 
	const user = await User.findOne({
		email: req.body.email,
	})
	console.log(user)
	if(!user) {return res.json({status: 'error', eerror: 'Invalid username'})}

	// verify password like this: 
	const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
	const jwtTokenKey = process.env.TOKEN_KEY;

	if (isPasswordValid) {
		const jwtToken = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			jwtTokenKey
		)

		// for successful log out, create a login cookie
		// res.cookie('jwt', jwtToken, {httpOnly: true, maxAge: maxAge * 1000} ); 
		
		return res.json({ status: 'ok', user: jwtToken })
	} 
	else {
		return res.json({ status: 'error', user: false })
	}
		
	
})
	
app.get("/backend/logout", async (req, res) => {
	const token = req.headers['x-access-token']
	try {
		// const decoded = jwt.verify(token, jwtTokenKey)
		// convert current loging cookie to a very short-lived one
		// res.cookie('jwt', '', {maxAge: 1})
		return res.json({status: 'ok'})
	}
	catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
		
	}
});


// MAIN PAGE 


app.get('/backend/main', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, jwtTokenKey)
		const email = decoded.email
		const user = await User.findOne({email: email}, )

		return res.json({status: 'ok', quote: user.quote})
	}
	catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
		
	}
	
})

// for creating a quote
app.post('/backend/main', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, jwtTokenKey)
		const email = decoded.email
		console.log("submitted quote: ", req.body.quote)
		await User.updateOne({email: email}, { $set: {quote: req.body.quote}} )
		return res.json({status: 'ok'}) 
	}
	catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
		
		// const user = await User.findOne({
		// 	email: req.body.email,
		// 	password: req.body.password,
		// })
		// console.log(user)
		
		
		// return res.json({ status: 'error', user: false })
	}
	
})

// Create new review post  
app.post('/backend/review', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, jwtTokenKey)
		const email = decoded.email
		console.log("submitted review post: ", req.body.post)
		await User.updateOne({email: email}, { $push: {post: req.body.post}} )
		return res.json({status: 'ok'}) 
	}
	catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
		
		// const user = await User.findOne({
		// 	email: req.body.email,
		// 	password: req.body.password,
		// })
		// console.log(user)
		
		
		// return res.json({ status: 'error', user: false })
	}
	
})

// SEND EMAIL
app.post('/backend/contact', async (req, res) => {
	console.log(req.body)
	try {
		
		console.log("req.body.name: ", req.body.name)

		sendEmail(req.body.name, req.body.email, req.body.title, req.body.description)
		
		return res.json({ status: 'ok', message:'Contact form is successfully submitted' })
	} catch (err) {
		console.log("Error: ", err)
		return res.json({ status: 'error', error: 'Contact form was not submitted' })
	}
})
function sendEmail(name, email, title, description){
	const transporter = nodemailer.createTransport({
		service: "gmail", 
		// port: "587",
		auth: {
			user: "test.yiryoung@gmail.com",
			pass: "znfiothyyyukscef",
		}, 
		tls:{
			rejectUnauthorized: false, 
		}, 
	}); 
	
	let mailOptions = {
		from: "test.yiryoung@gmail.com",
		to:"rainmaua@gmail.com",
		subject: "Contact Form Notificattion: "+title,
		text: "From: "+name+"\nEmail: "+email+"\nMessage: "+description,
	}; 
	
	transporter.sendMail(mailOptions, function(error, success){
		if (error) {
			console.log(error)
		}
		else {
			console.log("Email sent sucessfully")
		}
	}); 
	
}




app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});

