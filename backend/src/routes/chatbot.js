require("dotenv").config({ path: ".env.aws" });
const express = require("express");
const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2");

const router = express.Router();

const lexClient = new LexRuntimeV2Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


router.post("/", async (req, res) => {
    try {
        const { message, sessionId } = req.body; // Destructure sessionId
        const params = {
            botId: process.env.AWS_BOT_ID,
            botAliasId: process.env.AWS_BOT_ALIAS_ID,
            localeId: "en_US",
            sessionId: sessionId || "default-session", 
            text: message,
        };

        console.log("Lex Parameters:", params); 

        const command = new RecognizeTextCommand(params);
        const response = await lexClient.send(command);

        console.log("Lex Response:", response); 

        res.json({ reply: response.messages[0]?.content || "I didn't understand that." });
    } catch (error) {
        console.error("Error communicating with Lex:", error.message); 
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;