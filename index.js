import express from "express";
import cors from "cors";
import https from "https"; // Moved to top-level
import routes from "./Routes/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

const receivedEvents = []; // Store temporarily; use DB in production

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Root Route
app.get("/", (req, res) => {
    return res.send("hello world");
});

// SNS Event Receiver
app.post("//sns-events", (req, res) => {
    const snsMessageType = req.headers["x-amz-sns-message-type"];
    const body = req.body;

    if (!snsMessageType) {
        return res.status(400).send("Missing SNS message type header");
    }

    if (snsMessageType === "SubscriptionConfirmation") {
        const subscribeUrl = body.SubscribeURL;
        if (subscribeUrl) {
            https.get(subscribeUrl, () => {
                console.log("✅ Subscription confirmed:", subscribeUrl);
            });
        }
    } else if (snsMessageType === "Notification") {
        try {
            const message = JSON.parse(body.Message);
            console.log("📨 Received SES event:", message);
            receivedEvents.push(message); // In production: save to DB
        } catch (err) {
            console.error("❌ Error parsing SNS message:", err.message);
        }
    }

    res.sendStatus(200);
});

// Update the path to match what you're trying to access
app.get("/api/email-events", (req, res) => {
    res.json(receivedEvents); // Or fetch from DB if used
});


// Use additional routes
app.use(routes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server is running on PORT ${PORT}`));
