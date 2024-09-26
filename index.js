const express = require('express')
const app = express()
const cors = require('cors')
const {connectDB} = require('./src/config/dbConnection')
// cookie-session middleware:
const session = require('cookie-session')

// ENV Variables:
require('dotenv').config()

// Connect to DB
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(session({
    secret: process.env.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 3,  // 3 days
    httpOnly: true,
    // Verify these settings later.
}))

// Routes
app.use('/', require('./src/routes'))
//after this, we can access the session object in req.session.
// This will decrypt the cookie and store the session data in req.session
// to save data to the cookie/session, we can simply add properties to req.session
// When the server sends the response, the session data will be encrypted and stored in the cookie automatically.

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})