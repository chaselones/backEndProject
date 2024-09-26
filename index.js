const express = require('express')
const app = express()
const cors = require('cors')
const {connectDB} = require('./src/config/dbConnection')

// ENV Variables:
require('dotenv').config()

connectDB()

app.use(express.json())

app.use(cors())

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})