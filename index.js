import express from "express"
import cors from "cors"

const app = express()

const PORT = process.env.PORT || 4000

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    return res.send("hello world")
})

//Routes file
import routes from "./Routes/index.js"

app.use(routes)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))