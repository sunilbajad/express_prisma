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


const receivedEvents = []; // You can store this in DB instead

app.post("//sns-events", (req, res) => {
    const snsMessageType = req.headers["x-amz-sns-message-type"];
    const body = req.body;

    if (snsMessageType === "SubscriptionConfirmation") {
        // Confirm the SNS subscription
        const https = require("https");
        https.get(body.SubscribeURL, () => {
            console.log("Subscription confirmed");
        });
    } else if (snsMessageType === "Notification") {
        // Receive and store the event
        const message = JSON.parse(body.Message);
        console.log("Received SES event:", message);
        receivedEvents.push(message); // Replace with DB storage
    }

    res.sendStatus(200);
});

app.get("/api/events", (req, res) => {
    res.json(receivedEvents); // Or fetch from DB
});

app.use(routes)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))