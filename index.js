const express = require('express');
const fs = require('fs')
const https = require('https')
const app = express();

const data = require('./db/data')
const users = data.data()

const dotenv = require('dotenv')
dotenv.config()

app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(express.json())

const { auth, requiresAuth } = require('express-openid-connect')
const port = process.env.PORT || 4080;

var baseURL 

if (process.env.PORT) {
	baseURL = process.env.APP_URL
} else {
	baseURL = `https://localhost:${port}`
}

const config = {
	authRequired: false,
	idpLogout: true,
	auth0Logout: true,
	issuerBaseURL: process.env.ISSUER_BASE_URL,
	baseURL: baseURL,
	clientID: process.env.CLIENT_ID,
	secret: process.env.SECRET,
	clientSecret: process.env.CLIENT_SECRET,
	authorizationParams: {
		response_type: 'code',
	},
}

app.use(auth(config))

app.get('/', (req, res) => {
	req.user = {
		isAuthenticated: req.oidc.isAuthenticated()
	}
	if (req.user.isAuthenticated) {
		req.user.name = req.oidc.user.name
	}
	res.sendFile(__dirname + '/views/index.html')
})

app.get('/recentUsers', (req, res) => {
	req.user = {
		isAuthenticated: req.oidc.isAuthenticated()
	}
	if (req.user.isAuthenticated) {

		const recentUsers = getRecentUsers(users, req.oidc.user.name)
		res.send(recentUsers)
	}
})

app.post('/userLocation', (req, res) => {
	req.user = {
		isAuthenticated: req.oidc.isAuthenticated()
	}
	if (req.user.isAuthenticated) {

		const user = req.oidc.user.name
		const date = new Date() 

		console.log(date)
		
		console.log(req.body)
		users.unshift({
			user,
			latitude : req.body.lat,
			longitude : req.body.lon,
			date
		})

		console.log(users)
	}
})

app.get('/private', requiresAuth(), (req, res) => {
	const user = JSON.stringify(req.oidc.user)
	console.log(user.niskname)
	res.render('private', {user})
})

app.get("/sign-up", (req, res) => {
	res.oidc.login({
		returnTo: '/',
		authorizationParams: {
			screen_hint: "signup",
		},
	});
});

const hostname = '127.0.0.1';

https.createServer({
	key: fs.readFileSync(__dirname + '/cert/server.key'),
	cert: fs.readFileSync(__dirname + '/cert/server.cert'),
}, app)
	.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`))


function getRecentUsers(users, user) {
	const recentUsers = []
	const usersSet = new Set()
	
	for (let i = 0; i < users.length; i++) {
		if (!usersSet.has(users[i].user) && users[i].user != user) {
			usersSet.add(users[i].user)
			recentUsers.unshift(users[i])
		}
		if (recentUsers.length == 5) {
			break
		}
	}
	
	return recentUsers
}


