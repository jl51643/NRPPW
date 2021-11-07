const express = require('express');
const fs = require('fs')
const https = require('https')
const app = express();

const data = require('./db/data')
const users = data.data()

const dotenv = require('dotenv')
dotenv.config()

app.use(express.static('public'));
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');

app.use(express.json())

const { auth, requiresAuth } = require('express-openid-connect')
const port = process.env.PORT || 4080;

const baseURL = process.env.APP_URL || `https://localhost:${port}`

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
		res.send(200, {user: req.oidc.user.name,
			 			recentUsers: recentUsers})
	} else {
		res.send(401, {message : 'Unautorised'})
	}
})

app.get('/user', (req, res) => {
	req.user = {
		isAuthenticated: req.oidc.isAuthenticated()
	}
	if (req.user.isAuthenticated) {
		res.send(200, {user: req.oidc.user.name})
	} else {
		res.send(401, {message : 'Unautorised'})
	}
})

app.post('/userLocation', (req, res) => {
	req.user = {
		isAuthenticated: req.oidc.isAuthenticated()
	}
	if (req.user.isAuthenticated) {

		const user = req.oidc.user.name
		const date = new Date() 

		users.unshift({
			user,
			latitude : req.body.lat,
			longitude : req.body.lon,
			date
		})
	} else {
		res.send(401, {message : 'Unautorised'})
	}
})

app.get('/private', requiresAuth(), (req, res) => {
	const user = JSON.stringify(req.oidc.user)
	const u = JSON.parse(user)
	res.render('private', {u})
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

if (!process.env.PORT) {
	https.createServer({
		key: fs.readFileSync(__dirname + '/cert/server.key'),
		cert: fs.readFileSync(__dirname + '/cert/server.cert'),
	}, app)
		.listen(port, () => console.log(`Server running at http://${hostname}:${port}/`))
} else {
	app.listen(port, () => console.log(`Server running on ${baseURL}`))
}

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


