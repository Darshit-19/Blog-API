const express = require('express')
require('dotenv').config()
const dbConnection = require('./utility/db')
const userRoutes = require('./routes/userRoutes')
const blogController = require('./routes/blogRoutes')

const app = express()

const PORT  = process.env.PORT || 3000

dbConnection()

app.use(express.json())
app.use('/api/auth',userRoutes)
app.use('/api',blogController)


app.listen(PORT ,() => {
    console.log(`server started at port ${PORT}`);
})

