const express = require('express')

const app = express()
//setting up default port
const port = process.env.PORT || 5000
//Binding our server to a static directory
app.use(express.static("./public"))


app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})