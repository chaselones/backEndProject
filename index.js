const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use('dotenv').config()
app.use(cors())

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})