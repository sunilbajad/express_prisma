// const express = require("express");
import express from 'express';
const app = express();
app.use(express.json());

const receivedEvents = []; // You can store this in DB instead

app.post("/sns-events", (req, res) => {
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

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});
